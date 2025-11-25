import { differenceInDays } from "date-fns";

export function convertRupiah(nominal: string | number): string {
  const number = String(nominal).replace(/\D/g, "");
  if (!number) return "";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(number));
}

export type TotalHargaPayload = {
  tanggal_mulai: Date | string;
  tanggal_akhir: Date | string;
  jenis_sewa?: string | null;
  helm?: number | null;
  mantel?: number | null;
  harga_kendaraan: number;
};

export function calculateTotalHarga(payload: TotalHargaPayload): number {
  const tanggalMulai = new Date(payload.tanggal_mulai);
  const tanggalAkhir = new Date(payload.tanggal_akhir);

  const durasiRaw = differenceInDays(tanggalAkhir, tanggalMulai);
  const durasi = Math.max(1, durasiRaw);

  const hargaKendaraanTotal = durasi * payload.harga_kendaraan;
  const hargaSopirTotal =
    payload.jenis_sewa?.toLowerCase() === "dengan sopir" ? durasi * 250000 : 0;
  const hargaHelmTotal = durasi * (payload.helm ?? 0) * 5000;
  const hargaMantelTotal = durasi * (payload.mantel ?? 0) * 5000;

  return (
    hargaKendaraanTotal + hargaSopirTotal + hargaHelmTotal + hargaMantelTotal
  );
}
