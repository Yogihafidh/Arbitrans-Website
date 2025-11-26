"use server";

import { differenceInDays } from "date-fns";
import { redirect } from "next/navigation";
import { Booking } from "../_types/booking";
import { calculateTotalHarga } from "../_utils/helper";
import { getKendaraan } from "./data-services";
import { supabase } from "./supabase";

export const createRental = async function (rentalData: Booking) {
  console.log(rentalData);

  if (!rentalData.tanggal_mulai || !rentalData.tanggal_akhir) {
    throw new Error("Tanggal mulai dan akhir wajib diisi.");
  }

  // Ambil data kendaraan
  const { data: kendaraanData, error: kendaraanError } = await supabase
    .from("kendaraan")
    .select("nama_kendaraan, harga_sewa")
    .eq("id", rentalData.id_kendaraan)
    .single();

  if (kendaraanError || !kendaraanData) {
    console.error("Error ambil kendaraan: ", kendaraanError);
    throw new Error("Data kendaraan tidak ditemukan.");
  }

  // Hitung total harga
  const totalHarga = calculateTotalHarga({
    tanggal_mulai: rentalData.tanggal_mulai,
    tanggal_akhir: rentalData.tanggal_akhir,
    jenis_sewa: rentalData.jenis_sewa,
    helm: rentalData.helm,
    mantel: rentalData.mantel,
    harga_kendaraan: kendaraanData.harga_sewa,
  });

  // Set status menjadi "Belum Dibayar" dan total harga
  const bookingData = {
    ...rentalData,
    url_id_karyawan: rentalData.url_id_karyawan ?? null,
    url_tiket_kereta: rentalData.url_tiket_kereta ?? null,
    status: "Belum Dibayar",
    total_harga: totalHarga,
  };

  // Insert booking ke database
  const { error } = await supabase
    .from("booking")
    .insert([bookingData])
    .select();

  if (error) {
    console.error("Error dalam membuat rental: ", error);
    throw new Error("Gagal membuat rental.");
  }

  // Format tanggal Indonesia
  const tglMulai = new Date(rentalData.tanggal_mulai).toLocaleDateString(
    "id-ID",
    { day: "2-digit", month: "long", year: "numeric" }
  );

  const tglAkhir = new Date(rentalData.tanggal_akhir).toLocaleDateString(
    "id-ID",
    { day: "2-digit", month: "long", year: "numeric" }
  );

  // Hitung total hari sewa
  const totalHari = Math.max(
    1,
    differenceInDays(
      new Date(rentalData.tanggal_akhir),
      new Date(rentalData.tanggal_mulai)
    )
  );

  // Pesan WA
  let pesan = `Halo, saya ${rentalData.nama_pelanggan} dengan alamat ${rentalData.alamat} akan menyewa kendaraan ${kendaraanData.nama_kendaraan} dari ${tglMulai} sampai ${tglAkhir} selama ${totalHari} hari.`;

  // Tambahkan detail lokasi dan waktu
  if (rentalData.lokasi_pengambilan) {
    pesan += `\n\nLokasi Pengambilan: ${rentalData.lokasi_pengambilan}`;
  }
  if (rentalData.waktu_pengambilan) {
    pesan += `\nWaktu Pengambilan: ${rentalData.waktu_pengambilan}`;
  }
  if (rentalData.lokasi_pengembalian) {
    pesan += `\nLokasi Pengembalian: ${rentalData.lokasi_pengembalian}`;
  }
  if (rentalData.waktu_pengembalian) {
    pesan += `\nWaktu Pengembalian: ${rentalData.waktu_pengembalian}`;
  }

  // Tambahkan detail jenis sewa
  if (rentalData.jenis_sewa) {
    pesan += `\n\nJenis Sewa: ${rentalData.jenis_sewa}`;
  }

  // Tambahkan detail tambahan untuk motor
  if (rentalData.helm || rentalData.mantel) {
    pesan += `\n\nTambahan:`;
    if (rentalData.helm) {
      pesan += `\n- Helm: ${rentalData.helm} unit`;
    }
    if (rentalData.mantel) {
      pesan += `\n- Mantel: ${rentalData.mantel} unit`;
    }
  }

  pesan += `\n\nTotal: Rp ${totalHarga.toLocaleString("id-ID")}`;

  const encodedPesan = encodeURIComponent(pesan);

  // Redirect ke WhatsApp
  redirect(`https://wa.me/6281328864042?text=${encodedPesan}`);
};

export async function loadMoreKendaraan(
  currentCount: number,
  jenisKendaraan?: string,
  startDate?: string,
  endDate?: string
) {
  try {
    const additionalData = await getKendaraan(
      8,
      currentCount,
      jenisKendaraan,
      startDate,
      endDate
    );

    return {
      success: true,
      data: additionalData,
      hasMore: additionalData.length === 8,
    };
  } catch (error) {
    console.error("Error in loadMoreKendaraan:", error);
    return {
      success: false,
      error: "Gagal memuat data tambahan",
      data: [],
      hasMore: false,
    };
  }
}
