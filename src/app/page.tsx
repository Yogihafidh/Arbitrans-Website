import { Suspense } from "react";
import Footer from "./_components/Footer";
import Header from "./_components/Header";
import Searchbar from "./_components/Searchbar";
import AboutUs from "./_feature/homepage/AboutUs";
import CallToAction from "./_feature/homepage/CallToAction";
import CarouselBrand from "./_feature/homepage/CarouselBrand";
import HeroSection from "./_feature/homepage/HeroSection";
import Kontak from "./_feature/homepage/Kontak";
import LangkahRental from "./_feature/homepage/LangkahRental";
import LayananKami from "./_feature/homepage/LayananKami";
import MengapaPilihKami from "./_feature/homepage/MengapaPilihKami";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <Suspense fallback={<div className="h-20 animate-pulse bg-gray-200" />}>
          <Searchbar />
        </Suspense>
        <AboutUs />
        <CarouselBrand />
        <MengapaPilihKami />
        <LayananKami />
        <LangkahRental />
        <CallToAction />
        <Kontak />
        <Footer />
      </main>
    </>
  );
}
