import Breadcrumbs from "@/app/_components/Breadcump";
import Footer from "@/app/_components/Footer";
import Header from "@/app/_components/Header";
import DetailRental from "@/app/_feature/detailKendaraan/DetailRental";
import Gallery from "@/app/_feature/detailKendaraan/Gallery";
import RekomendasiKendaraan from "@/app/_feature/detailKendaraan/RekomendasiKendaraan";
import { getDataKendaraan } from "@/app/_libs/data-services";

type DetailPageParams = {
  rentalId: string;
};

interface DetailPageProps {
  params: DetailPageParams;
}

export async function generateMetadata({ params }: DetailPageProps) {
  const { rentalId } = params;
  const { nama_kendaraan } = await getDataKendaraan(Number(rentalId));
  return { title: `${nama_kendaraan}` };
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { rentalId } = params;
  const kendaraan = await getDataKendaraan(Number(rentalId));

  return (
    <>
      <Header />
      <Breadcrumbs kendaraanName={kendaraan.nama_kendaraan} />
      <Gallery imageKendaraan={kendaraan.imageKendaraan} />
      <DetailRental data={kendaraan} />
      <RekomendasiKendaraan jenisKendaraan={kendaraan.jenis_kendaraan} />
      <Footer />
    </>
  );
}
