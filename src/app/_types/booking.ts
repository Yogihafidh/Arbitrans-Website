export interface Booking {
  id_kendaraan: number;
  tanggal_mulai: Date | null;
  tanggal_akhir: Date | null;
  status: string;
  nama_pelanggan?: string;
  nik?: string;
  no_telephone?: string;
  alamat?: string;
  lokasi_pengambilan?: string;
  lokasi_pengembalian?: string;
  waktu_pengambilan?: string;
  waktu_pengembalian?: string;
  jenis_sewa?: string;
  helm?: number;
  mantel?: number;
  total_harga?: number;
  url_ktp_penyewa?: string;
  url_ktp_penjamin?: string;
  url_id_karyawan?: string | null;
  url_sim_a?: string;
  url_tiket_kereta?: string | null;
}
