"use client";
import Link from "next/link";

interface BreadcrumbsProps {
  kendaraanName?: string;
}

export default function Breadcrumbs({ kendaraanName }: BreadcrumbsProps) {
  return (
    <ol className="flex flex-wrap items-center pt-20 sm:pt-32 lg:pt-36 mb-4 sm:mb-6 lg:mb-8 px-4 sm:px-6 lg:px-24 text-sm sm:text-base">
      <li className="inline-flex items-center">
        <Link
          href="/rental"
          className="flex items-center text-netral-900 cursor-pointer hover:text-primary hover:underline"
        >
          Rental Kendaraan
        </Link>
        {kendaraanName && <span className="mx-2 text-netral-600">/</span>}
      </li>

      {kendaraanName && (
        <li className="inline-flex items-center">
          <span className="text-netral-600" aria-current="page">
            {kendaraanName}
          </span>
        </li>
      )}
    </ol>
  );
}
