"use client";
import { useState } from "react";
import InputDate from "./InputDate";
import InputSelect from "./InputSelect";
import Button from "./Button";
import { addDays } from "date-fns";

interface searchbar {
  className?: string;
}

function Searchbar({ className }: searchbar) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selected, setSelected] = useState("");

  const todayString = new Date().toISOString().split("T")[0];

  return (
    <div
      className={`relative z-20 -mt-20 px-24 flex items-center justify-center ${className}`}
    >
      <div
        className="bg-netral-100 rounded-2xl p-6 grid grid-cols-[0.8fr_1fr_1fr_0.5fr] w-full items-end gap-4"
        style={{
          boxShadow: "0px 2px 24px rgba(0,0,0,0.08)",
        }}
      >
        <div>
          <label
            htmlFor="vehicleType"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Jenis Kendaraan
          </label>
          <InputSelect
            value={selected}
            onChange={setSelected}
            placeholder="Pilih opsi"
            options={[
              { value: "mobil", label: "Mobil" },
              { value: "motor", label: "Motor" },
            ]}
          />
        </div>

        <div>
          <label
            htmlFor="startDate"
            className="mb-2 block  text-sm font-medium text-gray-700"
          >
            Tanggal Awal Sewa
          </label>
          <InputDate
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText="Pilih tanggal awal"
          />
        </div>

        <div>
          <label
            htmlFor="endDate"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Tanggal Akhir Sewa
          </label>
          <InputDate
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            minDate={startDate ? addDays(startDate, 1) : undefined}
            placeholderText="Pilih tanggal akhir"
          />
        </div>

        <div>
          <Button
            text="Cari"
            className="w-full"
            leftIcon={
              <svg
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M20.4382 7.66933C19.012 4.24469 15.6704 2.01004 11.9607 2.00013C7.96246 1.97907 4.40737 4.54006 3.16105 8.3391C1.91473 12.1381 3.2619 16.3074 6.49559 18.6588C9.72927 21.0103 14.1107 21.0068 17.3407 18.6501L20.2207 21.5301C20.5135 21.8226 20.9878 21.8226 21.2807 21.5301C21.5731 21.2373 21.5731 20.7629 21.2807 20.4701L18.4907 17.6801C21.0968 15.04 21.8644 11.094 20.4382 7.66933ZM19.1011 14.1691C17.9036 17.0547 15.0849 18.9342 11.9607 18.9301V18.8901C7.72037 18.8847 4.27812 15.4603 4.25066 11.2201C4.24662 8.09586 6.12605 5.27717 9.01172 4.0797C11.8974 2.88223 15.2203 3.54208 17.4295 5.75127C19.6387 7.96046 20.2986 11.2834 19.1011 14.1691Z"
                  fill="#F8F9FA"
                />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
}

export default Searchbar;
