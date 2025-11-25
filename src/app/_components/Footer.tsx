"use client";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import Link from "next/link";

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer
      className="rounded-none shadow-sm bg-primary/10 py-8 md:py-12 lg:py-16 px-6 sm:px-12 lg:px-20"
      id="footer"
    >
      <div className="flex md:flex-row flex-col items-center justify-center md:items-start md:justify-between gap-10 md:gap-4">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <Logo color="blue" />
          <p className="font-medium text-netral-700 mt-3">
            Rental Mudah. Kendaraan Siap. Langsung Berangkat!
          </p>
        </div>
        <ul className="flex items-center gap-6 flex-wrap justify-center">
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
                pathname === "/rental" ? "text-netral-900" : "text-netral-600"
              }`}
            >
              Rental Kendaraan
            </Link>
          </li>
        </ul>
      </div>
      <hr className="border-t border-netral-400 my-6" />
      <span className="block text-sm text-netral-600 sm:text-center">
        © 2025{" "}
        <a href="https://arbitrans.com/" className="hover:underline">
          ARBITRANS
        </a>{" "}
        | All Rights Reserved.
      </span>
    </footer>
  );
}