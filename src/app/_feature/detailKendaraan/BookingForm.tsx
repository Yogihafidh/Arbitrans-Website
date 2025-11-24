"use client";
import Button from "@/app/_components/Button";
import { useRouter } from "next/navigation";
import { convertRupiah } from "@/app/_utils/helper";

interface Props {
  idKendaraan: number;
  harga: number;
}

export default function BookingForm({ idKendaraan, harga }: Props) {
  const router = useRouter();

  return (
    <div className="bg-white w-full rounded-2xl p-6 border border-netral-400 sticky top-24">
      <div className="flex flex-col items-end">
        <span className="text-xs text-netral-600">mulai dari</span>
        <span className="text-2xl sm:text-3xl font-semibold text-primary">
          {convertRupiah(harga)}
        </span>
      </div>

      <div className="mt-6">
        <Button
          text="Buat Pesanan"
          className="w-full px-6 py-3.5"
          onClick={() => router.push(`/rental/${idKendaraan}`)}
        />
      </div>

      <p className="text-xs text-netral-600 mt-3 text-center">
        Harga dapat berubah sesuai durasi sewa dan layanan tambahan.
      </p>
    </div>
  );
}
