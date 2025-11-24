import { Kendaraan } from "@/app/_types/kendaraan";
import { convertRupiah } from "@/app/_utils/helper";
import Link from "next/link";
import Button from "@/app/_components/Button";
import SectionDetailKendaraan from "./SectionDetailKendaraan";
import SpesifikasiKendaraan from "./SpesifikasiKendaraan";

const informasiPenting = [
  "Penggunaan lepas kunci selama 12-18 jam dari mulai sewa",
  "Sebelum pembayaran selesai, dokumen akan dilakukan verifikasi terlebih dahulu",
  "Penyewa wajib memiliki SIM yang aktif dan sesuai dengan jenis kendaraan yang disewa",
  "Saat pengambilan unit, penyewa wajib menunjukkan kartu identitas asli dan bersedia memberikan dokumen tambahan jika diminta.",
  "Setiap kendaraan disewa dengan kondisi layak jalan, bersih, dan bensin penuh. Harap dikembalikan dalam kondisi serupa.",
  "Keterlambatan pengembalian akan dikenakan denda 10% per jam keterlambatan. Jika setengah hari keterlambatan pengembalian, maka dihitung denda dengan biaya penuh.",
  "Pembatalan maksimal 24 jam sebelum waktu sewa untuk pengembalian dana penuh. Di bawah itu akan dikenakan potongan.",
  "Semua kerusakan yang terjadi akibat kelalaian penyewa menjadi tanggung jawab penyewa sepenuhnya.",
  "Penggunaan keluar kota dikenai charge biaya sebesar Rp30.000,-.",
  "Gunakan kendaraan dengan penuh tanggung jawab, dan segera hubungi CS jika terjadi kerusakan atau insiden saat masa sewa.",
];

const requirements = [
  "KTP milik penyewa.",
  "KTP penjamin (saudara / teman / orang satu rumah).",
  "ID Karyawan / NPWP / KTA / KTM.",
  "SIM C aktif jika menyewa motor dan SIM A aktif jika menyewa mobil.",
  "Tiket Kereta PP (Bagi wisatawan).",
  "Menjaminkan sepeda motor atas nama sendiri minimal tahun 2020, jika menyewa mobil.",
];

const benefits = [
  "Antar-jemput area Purwokerto dengan biaya terjangkau, yaitu Rp30.000,-",
  "Peminjaman helm dan mantel dengan harga Rp5.000,- per pcs dan per hari (Terpisah).",
  "Mobil bersih dan sudah melalui pemeriksaan standar siap untuk digunakan.",
  "Pengecekan kendaraan bersama saat penyerahan (cek bodi, interior, dan odometer).",
  "Kunci cadangan tersedia (jika dibutuhkan).",
  "Layanan customer support 24/7 selama masa sewa.",
];

interface DetailRentalProps {
  data: Kendaraan;
}

function DetailRental({ data }: DetailRentalProps) {
  return (
    <>
      {/* Header Kendaraan */}
      <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-netral-400 pb-6 sm:pb-8 pt-10 sm:pt-16 gap-4 sm:gap-0">
          <div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-netral-900">
              {data.nama_kendaraan}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-sm text-netral-600">
              <span className="text-yellow-400">★</span>
              <span className="font-medium">4.5/5</span>
              <span>(365 Ulasan)</span>
              <span>•</span>
              <span>Purwokerto, Banyumas</span>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1 leading-tight">
            <p className="text-sm sm:text-base text-netral-600">Harga Mulai</p>
            <p className="text-xl sm:text-2xl md:text-4xl font-semibold text-primary">
              {convertRupiah(data.harga_sewa)}
            </p>

            <div className="mt-3 w-full sm:w-auto">
              <Link href={`/rental/checkout/${data.id}`}>
                <Button text="Buat Pesanan" className="w-full sm:w-auto px-6 py-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
        <div className="grid grid-cols-1 gap-10 lg:gap-16 items-start">
          <div>
            <SpesifikasiKendaraan data={data} />

            <SectionDetailKendaraan
              heading="Informasi Penting untuk Dibaca Sebelum Menyewa"
              icon={
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.79 6.04C9.40648 6.08421 9.11703 6.40894 9.11703 6.795C9.11703 7.18106 9.40648 7.50579 9.79 7.55C9.9915 7.5528 10.1854 7.47329 10.327 7.32985C10.4685 7.18641 10.5455 6.99145 10.54 6.79C10.5346 6.37804 10.202 6.04539 9.79 6.04Z"
                    fill="#196FEB"
                  />
                  <path
                    d="M9.79 8.92C9.59027 8.91728 9.39792 8.99543 9.25667 9.13667C9.11543 9.27792 9.03728 9.47027 9.04 9.67V12.79C9.04 13.2042 9.37579 13.54 9.79 13.54C10.2042 13.54 10.54 13.2042 10.54 12.79V9.69C10.5454 9.48765 10.4688 9.2917 10.3275 9.14669C10.1863 9.00169 9.99243 8.91993 9.79 8.92Z"
                    fill="#196FEB"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.79 0C4.38542 0.00551207 0.00551207 4.38542 0 9.79C0 15.1969 4.38313 19.58 9.79 19.58C15.1969 19.58 19.58 15.1969 19.58 9.79C19.5745 4.38542 15.1946 0.00551207 9.79 0ZM9.79 18.08C5.21156 18.08 1.5 14.3684 1.5 9.79C1.5 5.21156 5.21156 1.5 9.79 1.5C14.3684 1.5 18.08 5.21156 18.08 9.79C18.0745 14.3662 14.3662 18.0745 9.79 18.08Z"
                    fill="#196FEB"
                  />
                </svg>
              }
              points={informasiPenting}
            />

            <SectionDetailKendaraan
              heading="Persyaratan Rental Kendaraan"
              icon={
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.7936 0.609708L15.3436 5.15971C16.175 5.99469 16.175 7.34473 15.3436 8.17971L12.5536 10.9697C12.395 11.1333 12.2604 11.3185 12.1536 11.5197L10.6136 14.6097C10.3037 15.2231 9.71924 15.6514 9.041 15.7621C8.36276 15.8728 7.67246 15.6527 7.18357 15.1697L4.51357 12.4997L1.28357 15.7297C1.14369 15.8713 0.952636 15.9507 0.75357 15.9497C0.553818 15.9542 0.361411 15.8744 0.22357 15.7297C0.0806222 15.5904 0 15.3993 0 15.1997C0 15.0001 0.0806222 14.809 0.22357 14.6697L3.45357 11.4397L0.78357 8.76971C0.296281 8.28277 0.0732012 7.59102 0.184202 6.91114C0.295204 6.23126 0.726712 5.64638 1.34357 5.33971L4.43357 3.79971C4.63482 3.69293 4.81998 3.55827 4.98357 3.39971L7.79357 0.609708C8.62835 -0.203236 9.95879 -0.203236 10.7936 0.609708ZM11.4236 9.82971L14.2036 7.04971C14.4205 6.84758 14.4339 6.50831 14.2336 6.28971L9.69357 1.74971C9.59378 1.64707 9.45672 1.58917 9.31357 1.58917C9.17042 1.58917 9.03336 1.64707 8.93357 1.74971L6.15357 4.52971C5.86141 4.81694 5.52345 5.05351 5.15357 5.22971L2.06357 6.77971C1.90719 6.85233 1.7981 6.99905 1.77357 7.16971C1.74111 7.33864 1.79777 7.51239 1.92357 7.62971L8.32357 14.0297C8.41824 14.1337 8.55299 14.1919 8.69357 14.1897C8.89875 14.1932 9.08678 14.0757 9.17357 13.8897L10.7236 10.8297C10.8998 10.4598 11.1363 10.1219 11.4236 9.82971Z"
                    fill="#BC0F0F"
                  />
                </svg>
              }
              points={requirements}
            />

            <SectionDetailKendaraan
              heading="Fasilitas yang Ditawarkan"
              icon={
                <svg
                  width="17"
                  height="12"
                  viewBox="0 0 17 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.20948 11.5602C5.04155 11.5676 4.87603 11.5183 4.73948 11.4202L0.249483 7.71024C-0.0397957 7.45413 -0.0833516 7.01857 0.149483 6.71024C0.405152 6.4223 0.837337 6.37476 1.14948 6.60024L5.14948 9.86024L15.6495 0.150241C15.96 -0.0828876 16.3971 -0.0404685 16.657 0.248016C16.9169 0.5365 16.9136 0.97565 16.6495 1.26024L5.71948 11.3602C5.58026 11.488 5.39843 11.5593 5.20948 11.5602Z"
                    fill="#03814B"
                  />
                </svg>
              }
              points={benefits}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailRental;
