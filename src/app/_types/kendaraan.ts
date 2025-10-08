export interface ImageKendaraan {
  url_gambar: string;
}

export interface Kendaraan {
  id: string;
  nama_kendaraan: string;
  harga_sewa: number; 
  kapasitas_penumpang: number;
  luas_bagasi: string;
  transmisi: string;
  bahan_bakar: string;
  imageKendaraan: { url_gambar: string }[];

  // Opsional fields
  jenis_kendaraan?: string;
  tipe_kendaraan?: string;
  tahun_produksi?: number;
  deskripsi_kendaraan?: string;

  // properti tambahan
  statusHariIni?: string;
  tanggal_mulai?: Date | null;
  tanggal_akhir?: Date | null;
}
