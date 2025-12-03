import { format } from "date-fns";
import { Booking } from "../_types/booking";
import { Kendaraan } from "../_types/kendaraan";
import { supabase } from "./supabase";

export const getKendaraan = async function (
  limit: number = 8,
  offset: number = 0,
  jenisKendaraan?: string,
  startDate?: string,
  endDate?: string
): Promise<Kendaraan[]> {
  const today = format(new Date(), "yyyy-MM-dd");
  const filterStart = startDate || today;
  const filterEnd = endDate || today;

  // 1. Query booking yang sedang berjalan atau masih berstatus Disewa/Lunas
  const { data: bookingHariIni, error: errorBooking } = await supabase
    .from("booking")
    .select("id_kendaraan, tanggal_mulai, tanggal_akhir, status")
    .or(
      `and(tanggal_mulai.lte.${filterEnd},tanggal_akhir.gte.${filterStart},status.neq.Selesai),` +
        `and(tanggal_akhir.lt.${filterStart},status.eq.Telat),` +
        `status.eq.Disewa,status.eq.Lunas`
    );

  if (errorBooking) {
    console.error("Error ambil booking: ", errorBooking);
    throw new Error("Gagal cek data booking.");
  }

  // 1.1 Mengubah bentuk data menjadi map untuk memudahkan pencarian booking berdasarkan ID kendaraan
  const mapBooking = new Map<number, Booking>();
  bookingHariIni?.forEach((booking) => {
    mapBooking.set(booking.id_kendaraan, booking);
  });

  // 2. Ambil semua data kendaraan tanpa limit
  let kendaraanQuery = supabase
    .from("kendaraan")
    .select(
      "nama_kendaraan, id, harga_sewa, kapasitas_penumpang, luas_bagasi, transmisi, bahan_bakar, jenis_kendaraan, imageKendaraan(url_gambar)"
    )
    .order("nama_kendaraan");

  if (jenisKendaraan) {
    kendaraanQuery = kendaraanQuery.eq("jenis_kendaraan", jenisKendaraan);
  }

  const { data: semuaKendaraan, error: errorKendaraan } = await kendaraanQuery;

  if (errorKendaraan) {
    console.error("Error ambil kendaraan: ", errorKendaraan);
    throw new Error("Data kendaraan tidak bisa diambil.");
  }

  // 3. Gabungkan dengan status dan pisahkan berdasarkan ketersediaan
  const kendaraanTersedia: Kendaraan[] = [];
  const kendaraanDisewa: Kendaraan[] = [];

  semuaKendaraan?.forEach((k) => {
    const booking = mapBooking.get(k.id);
    const kendaraanWithStatus = {
      ...k,
      statusHariIni: booking ? ("Disewa" as const) : ("Tersedia" as const),
      tanggal_mulai: booking?.tanggal_mulai,
      tanggal_akhir: booking?.tanggal_akhir,
    };

    if (booking) {
      kendaraanDisewa.push(kendaraanWithStatus);
    } else {
      kendaraanTersedia.push(kendaraanWithStatus);
    }
  });

  // 4. Buat array final dengan prioritas: Tersedia dulu, lalu Disewa
  const finalArray = [...kendaraanTersedia, ...kendaraanDisewa];

  // 5. Apply pagination pada array final
  const paginatedData = finalArray.slice(offset, offset + limit);

  return paginatedData;
};

export const getKendaraanCount = async function (
  jenisKendaraan?: string
): Promise<number> {
  try {
    let countQuery = supabase
      .from("kendaraan")
      .select("*", { count: "exact", head: true });

    if (jenisKendaraan) {
      countQuery = countQuery.eq("jenis_kendaraan", jenisKendaraan);
    }

    const { count, error } = await countQuery;

    if (error) {
      console.error("Error counting kendaraan:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("Error in getKendaraanCount:", error);
    return 0;
  }
};

export const getDataKendaraan = async function (id: number) {
  const { data: kendaraan, error: errorKendaraan } = await supabase
    .from("kendaraan")
    .select("*, imageKendaraan(url_gambar)")
    .eq("id", id)
    .single<Kendaraan>();

  if (errorKendaraan) {
    console.error("Error ambil kendaraan: ", errorKendaraan);
    throw new Error("Data kendaraan tidak bisa diambil.");
  }

  return kendaraan;
};
