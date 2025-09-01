"use client";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import Link from "next/link";

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer
      className="rounded-none shadow-sm bg-primary/10 py-10 md:py-16 lg:py-24 xl:py-32 px-8 sm:px-16 lg:px-24 xl:px-32"
      id="footer"
    >
      <div className="flex md:flex-row flex-col items-center justify-center md:items-start md:justify-between gap-16 md:gap-2">
        <div className="flex flex-col items-center md:items-start">
          <Logo color="blue" />
          <p className="font-medium text-netral-700 mt-4 sm:text-left text-center">
            Rental Mudah. Kendaraan Siap. Langsung Berangkat!
          </p>
        </div>
        <ul className="flex items-center gap-8 ">
          <li>
            <Link
              href="/"
              className={`hover:underline ${
                pathname === "/" ? "text-netral-900" : "text-netral-600"
              }`}
            >
              Beranda
            </Link>
          </li>
          <li>
            <Link
              href="/rental"
              className={`hover:underline ${
                pathname === "/" ? " text-netral-600" : "text-netral-900"
              }`}
            >
              Rental Kendaraan
            </Link>
          </li>
        </ul>
      </div>
      <hr className="border-t border-netral-500 my-6 md:my-12" />
      <span className="block text-sm text-netral-600 sm:text-center">
        © 2025{" "}
        <a href="https://arbitrans.com/" className="hover:underline">
          ARBITRANS
        </a>{" "}
        | . All Rights Reserved.
      </span>
    </footer>
  );
}
