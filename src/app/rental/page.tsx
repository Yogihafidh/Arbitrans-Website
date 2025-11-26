import { Suspense } from "react";
import Footer from "../_components/Footer";
import Header from "../_components/Header";
import LoadingSkeleton from "../_components/LoadingSkeleton";
import Searchbar from "../_components/Searchbar";
import HeadingRental from "../_feature/rentalKendaraan/HeadingRental";
import KendaraanCard from "../_feature/rentalKendaraan/KendaraanCard";

const SearchbarFallback = () => (
  <div className="!mt-0 mb-16 h-20 animate-pulse bg-gray-200" />
);

export const metadata = {
  title: "Daftar Kendaraan",
};

type RentalSearchParams = {
  startDate?: string;
  endDate?: string;
  jenis?: string;
};

type RentalSearchParamsPromise = Promise<RentalSearchParams | undefined>;

export default async function Rental({
  searchParams,
}: {
  searchParams: RentalSearchParamsPromise;
}) {
  const filters = await searchParams;
  const { jenis, startDate, endDate } = filters ?? {};

  return (
    <>
      <Header />
      <HeadingRental />
      <Suspense fallback={<SearchbarFallback />}>
        <Searchbar className="!mt-0 mb-16" />
      </Suspense>

      <Suspense fallback={<LoadingSkeleton count={4} />}>
        <KendaraanCard
          startDate={startDate}
          endDate={endDate}
          jenisKendaraan={jenis}
        />
      </Suspense>

      <Footer />
    </>
  );
}
