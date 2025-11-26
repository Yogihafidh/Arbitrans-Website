import Header from "@/app/_components/Header";
import Footer from "@/app/_components/Footer";
import Breadcrumbs from "@/app/_components/Breadcump";
import CheckoutForm from "@/app/_feature/checkout/CheckoutForm";
import CheckoutFormMotor from "@/app/_feature/checkout/CheckoutFormMotor";
import { getDataKendaraan } from "@/app/_libs/data-services";
import { format, differenceInDays } from "date-fns";
import { id } from "date-fns/locale";

type RentalParamsPromise = Promise<{ rentalId: string }>;

interface CheckoutSearchParams {
  from?: string;
  to?: string;
}

type CheckoutSearchParamsPromise = Promise<CheckoutSearchParams | undefined>;

export async function generateMetadata({
  params,
}: {
  params: RentalParamsPromise;
}) {
  const { rentalId } = await params;
  const { nama_kendaraan } = await getDataKendaraan(Number(rentalId));
  return { title: `Checkout - ${nama_kendaraan}` };
}

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: RentalParamsPromise;
  searchParams: CheckoutSearchParamsPromise;
}) {
  const { rentalId } = await params;
  const search = await searchParams;
  const kendaraan = await getDataKendaraan(Number(rentalId));

  // Get dates from search params or use defaults
  const fromDate = search?.from ? new Date(search.from) : new Date();
  const toDate = search?.to
    ? new Date(search.to)
    : new Date(new Date().getTime() + 86400000);

  const hariSewa = Math.max(1, differenceInDays(toDate, fromDate));

  const dariTanggal = format(fromDate, "EEEE, dd MMMM yyyy", { locale: id });
  const sampaiTanggal = format(toDate, "EEEE, dd MMMM yyyy", { locale: id });

  return (
    <>
      <Header />
      <Breadcrumbs kendaraanName="Checkout" />

      <main className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-8 sm:py-12">
        <h1 className="text-3xl font-bold text-netral-900 mb-8">
          Checkout Kendaraan
        </h1>

        {kendaraan?.jenis_kendaraan &&
        String(kendaraan.jenis_kendaraan).toLowerCase().includes("motor") ? (
          <CheckoutFormMotor
            kendaraanNama={kendaraan.nama_kendaraan}
            hargaSewa={Number(kendaraan.harga_sewa)}
            dariTanggal={dariTanggal}
            sampaiTanggal={sampaiTanggal}
            hariSewa={hariSewa}
            idKendaraan={Number(rentalId)}
            tanggalMulai={fromDate}
            tanggalAkhir={toDate}
          />
        ) : (
          <CheckoutForm
            kendaraanNama={kendaraan.nama_kendaraan}
            hargaSewa={Number(kendaraan.harga_sewa)}
            dariTanggal={dariTanggal}
            sampaiTanggal={sampaiTanggal}
            hariSewa={hariSewa}
            idKendaraan={Number(rentalId)}
            tanggalMulai={fromDate}
            tanggalAkhir={toDate}
          />
        )}
      </main>

      <Footer />
    </>
  );
}
