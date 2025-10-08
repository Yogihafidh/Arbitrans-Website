import { Suspense } from "react";
import Footer from "../_components/Footer";
import Header from "../_components/Header";
import LoadingSkeleton from "../_components/LoadingSkeleton";
import Searchbar from "../_components/Searchbar";
import HeadingRental from "../_feature/rentalKendaraan/HeadingRental";
import KendaraanCard from "../_feature/rentalKendaraan/KendaraanCard";

export const metadata = {
  title: "Daftar Kendaraan",
};

interface RentalPageProps {
  searchParams: Promise<{
    startDate?: string;
    endDate?: string;
    jenis?: string;
  }>;
}

export default async function Rental({ searchParams }: RentalPageProps) {
  const params = await searchParams;
  const { jenis, startDate, endDate } = params;

  return (
    <>
      <Header />
      <HeadingRental />
      <Searchbar className="!mt-0 mb-16" />
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
