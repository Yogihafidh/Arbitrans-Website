"use client";
import { useState, useMemo } from "react";
import CarCard from "@/app/_components/Card";
import Button from "@/app/_components/Button";
import { loadMoreKendaraan } from "@/app/_libs/action";
import { Kendaraan } from "@/app/_types/kendaraan";

interface KendaraanGridProps {
  initialData: Kendaraan[];
  totalCount: number;
  jenisKendaraan?: string;
  startDate?: string;
  endDate?: string;
  itemsPerPage: number;
  isLoadMore?: boolean;
}

export default function LoadMoreKendaraan({
  initialData,
  totalCount,
  jenisKendaraan,
  startDate,
  endDate,
  itemsPerPage,
  isLoadMore,
}: KendaraanGridProps) {
  const [additionalData, setAdditionalData] = useState<Kendaraan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allData = useMemo(() => {
    return [...initialData, ...additionalData];
  }, [initialData, additionalData]);

  const hasMoreData = isLoadMore ? allData.length < totalCount : false;

  const loadMore = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      const result = await loadMoreKendaraan(
        allData.length,
        jenisKendaraan,
        startDate,
        endDate
      );

      if (result.success) {
        setAdditionalData((prev) => [...prev, ...result.data]);
      } else {
        setError(result.error || "Gagal memuat data");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat memuat data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="px-4 md:px-8 lg:px-16 xl:px-24 pb-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-auto mb-16">
        {allData.map((data) => (
          <CarCard data={data} key={data.id} />
        ))}
      </div>

      {error && <div className="text-center text-red-500 mb-4">{error}</div>}

      {hasMoreData && (
        <div className="text-center">
          <Button
            variant="secondary"
            text={isLoading ? "Memuat..." : "Muat lebih banyak"}
            className="!border-none !bg-primary/10 !px-6 !py-3 mx-auto hover:!bg-primary/20 disabled:opacity-50"
            onClick={loadMore}
            disabled={isLoading}
          />
        </div>
      )}
    </section>
  );
}
