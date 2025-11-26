"use client";
import { convertRupiah } from "@/app/_utils/helper";
import { useState } from "react";
import { createRental } from "@/app/_libs/action";
import { Booking } from "@/app/_types/booking";

const DOCUMENT_TYPES = [
  "ktpPenyewa",
  "ktpPenjamin",
  "idKaryawan",
  "simA",
  "tiketKereta",
] as const;

type DocumentKey = (typeof DOCUMENT_TYPES)[number];

type DocumentUploadState = {
  uploading: boolean;
  url?: string;
  error?: string;
};

interface CheckoutFormProps {
  kendaraanNama: string;
  hargaSewa: number;
  dariTanggal: string;
  sampaiTanggal: string;
  hariSewa: number;
  idKendaraan: number;
  tanggalMulai: Date;
  tanggalAkhir: Date;
}

export default function CheckoutForm({
  kendaraanNama,
  hargaSewa,
  dariTanggal,
  sampaiTanggal,
  hariSewa,
  idKendaraan,
  tanggalMulai,
  tanggalAkhir,
}: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    nik: "",
    namaLengkap: "",
    noHp: "",
    alamat: "",
    lokasiPengambilan: "",
    lokasiPengembalian: "",
    jamPengambilan: "",
    jamPengembalian: "",
    jenisSewa: "Dengan Sopir",
    ktpPenyewa: null,
    ktpPenjamin: null,
    idKaryawan: null,
    simAktif: null,
    tiketKereta: null,
  });

  const [documents, setDocuments] = useState<
    Record<DocumentKey, DocumentUploadState>
  >(() =>
    DOCUMENT_TYPES.reduce((acc, key) => {
      acc[key] = { uploading: false };
      return acc;
    }, {} as Record<DocumentKey, DocumentUploadState>)
  );

  const isUploadingDocs = Object.values(documents).some((doc) => doc.uploading);

  const totalHarga = hargaSewa * hariSewa;
  const jesSodir = 250000;
  const totalDenganSopir = totalHarga + jesSodir;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDocumentUpload = async (
    docKey: DocumentKey,
    file?: File | null
  ) => {
    if (!file) return;

    setDocuments((prev) => ({
      ...prev,
      [docKey]: { uploading: true, error: undefined, url: prev[docKey].url },
    }));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", docKey);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal mengunggah dokumen.");
      }

      setDocuments((prev) => ({
        ...prev,
        [docKey]: { uploading: false, url: result.url, error: undefined },
      }));
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Upload dokumen gagal.";
      setDocuments((prev) => ({
        ...prev,
        [docKey]: {
          uploading: false,
          url: prev[docKey].url,
          error: message,
        },
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isUploadingDocs) {
      alert("Tunggu hingga seluruh dokumen selesai diunggah.");
      return;
    }

    const requiredDocs: DocumentKey[] = ["ktpPenyewa", "ktpPenjamin", "simA"];
    const missingDocs = requiredDocs.filter((doc) => !documents[doc].url);
    if (missingDocs.length > 0) {
      alert("Mohon unggah seluruh dokumen wajib sebelum melanjutkan.");
      return;
    }

    const bookingData: Booking = {
      id_kendaraan: idKendaraan,
      tanggal_mulai: tanggalMulai,
      tanggal_akhir: tanggalAkhir,
      status: "Belum Dibayar",
      nama_pelanggan: formData.namaLengkap,
      nik: formData.nik,
      no_telephone: formData.noHp,
      alamat: formData.alamat,
      lokasi_pengambilan: formData.lokasiPengambilan || undefined,
      lokasi_pengembalian: formData.lokasiPengembalian || undefined,
      waktu_pengambilan: formData.jamPengambilan || undefined,
      waktu_pengembalian: formData.jamPengembalian || undefined,
      jenis_sewa: formData.jenisSewa,
      url_ktp_penyewa: documents.ktpPenyewa.url,
      url_ktp_penjamin: documents.ktpPenjamin.url,
      url_id_karyawan: documents.idKaryawan.url,
      url_sim_a: documents.simA.url,
      url_tiket_kereta: documents.tiketKereta.url,
    };

    try {
      await createRental(bookingData);
    } catch (error) {
      console.error("Error creating rental:", error);
      alert("Terjadi kesalahan saat membuat booking. Silakan coba lagi.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Form Section */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Data Penyewa */}
          <div className="bg-white p-6 rounded-lg border border-netral-200">
            <h3 className="text-lg font-semibold text-netral-900 mb-4">
              Data Perental
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-netral-900 mb-2">
                  NIK
                </label>
                <input
                  type="text"
                  name="nik"
                  value={formData.nik}
                  onChange={handleInputChange}
                  placeholder="Masukan 16 digit NIK"
                  className="w-full border border-netral-300 rounded-lg px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-netral-900 mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="namaLengkap"
                  value={formData.namaLengkap}
                  onChange={handleInputChange}
                  placeholder="Jhon doe"
                  className="w-full border border-netral-300 rounded-lg px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-netral-900 mb-2">
                  No Hp
                </label>
                <input
                  type="text"
                  name="noHp"
                  value={formData.noHp}
                  onChange={handleInputChange}
                  placeholder="081xxxxxxxxx"
                  className="w-full border border-netral-300 rounded-lg px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-netral-900 mb-2">
                  Alamat
                </label>
                <input
                  type="text"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  placeholder="Masukan alamat"
                  className="w-full border border-netral-300 rounded-lg px-4 py-2.5 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Tanggal Sewa */}
          <div className="bg-white p-6 rounded-lg border border-netral-200">
            <h3 className="text-lg font-semibold text-netral-900 mb-4">
              Tanggal Sewa
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-netral-900 mb-2">
                  Tanggal/mulai sewa
                </label>
                <input
                  type="text"
                  disabled
                  value={dariTanggal}
                  className="w-full border border-netral-300 rounded-lg px-4 py-2.5 text-sm cursor-not-allowed"
                  style={{ backgroundColor: "#F9F9F9" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-netral-900 mb-2">
                  Tanggal akhir sewa
                </label>
                <input
                  type="text"
                  disabled
                  value={sampaiTanggal}
                  className="w-full border border-netral-300 rounded-lg px-4 py-2.5 text-sm cursor-not-allowed"
                  style={{ backgroundColor: "#F9F9F9" }}
                />
              </div>
            </div>
          </div>

          {/* Lokasi Pengambilan & Pengembalian */}
          <div className="bg-white p-6 rounded-lg border border-netral-200">
            <h3 className="text-lg font-semibold text-netral-900 mb-6">
              Pengambilan & Pengembalian
            </h3>
            <div className="space-y-6">
              {/* Pengambilan */}
              <div>
                <h4 className="text-sm font-medium text-netral-900 mb-3">
                  Pengambilan
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-netral-900 mb-2">
                      Lokasi Pengambilan
                    </label>
                    <input
                      type="text"
                      name="lokasiPengambilan"
                      value={formData.lokasiPengambilan}
                      onChange={handleInputChange}
                      placeholder="Masukan lokasi pengambilan motor"
                      className="w-full border border-netral-300 rounded-lg px-4 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-netral-900 mb-2">
                      Jam Pengambilan
                    </label>
                    <input
                      type="time"
                      name="jamPengambilan"
                      value={formData.jamPengambilan || ""}
                      onChange={handleInputChange}
                      placeholder="-- : --"
                      className="w-full border border-netral-300 rounded-lg px-4 py-2.5 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Pengembalian */}
              <div>
                <h4 className="text-sm font-medium text-netral-900 mb-3">
                  Pengembalian
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-netral-900 mb-2">
                      Lokasi Pengembalian
                    </label>
                    <input
                      type="text"
                      name="lokasiPengembalian"
                      value={formData.lokasiPengembalian}
                      onChange={handleInputChange}
                      placeholder="Masukan lokasi pengembalian motor"
                      className="w-full border border-netral-300 rounded-lg px-4 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-netral-900 mb-2">
                      Jam Pengembalian
                    </label>
                    <input
                      type="time"
                      name="jamPengembalian"
                      value={formData.jamPengembalian || ""}
                      onChange={handleInputChange}
                      placeholder="-- : --"
                      className="w-full border border-netral-300 rounded-lg px-4 py-2.5 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Jenis Sewa */}
          <div className="bg-white p-6 rounded-lg border border-netral-200">
            <h3 className="text-lg font-semibold text-netral-900 mb-4">
              Jenis Sewa
            </h3>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="jenisSewa"
                  value="Dengan Sopir"
                  checked={formData.jenisSewa === "Dengan Sopir"}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-netral-900">
                  Dengan Sopir
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="jenisSewa"
                  value="Tanpa Sopir"
                  checked={formData.jenisSewa === "Tanpa Sopir"}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-netral-900">
                  Tanpa Sopir
                </span>
              </label>
            </div>
            {formData.jenisSewa === "Dengan Sopir" && (
              <p className="text-xs text-red-500 mt-2">
                Modif: Driver + BBM/Harga mulai dr/wr 8 jam (±1 hr)
              </p>
            )}
          </div>

          {/* Unggah Dokumen */}
          <div className="bg-white p-6 rounded-lg border border-netral-200">
            <h3 className="text-lg font-semibold text-netral-900 mb-4">
              Unggah dokumen
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: "KTP Penyewa *",
                  key: "ktpPenyewa" as DocumentKey,
                  note: "Format: JPG, JPEG, PNG, HEIC, HEIF, WEBP",
                },
                {
                  label: "KTP Penjamin (Saudara/Teman) *",
                  key: "ktpPenjamin" as DocumentKey,
                  note: "Format: JPG, JPEG, PNG, HEIC, HEIF, WEBP",
                },
                {
                  label: "ID Karyawan / NPWP (AK TP)",
                  key: "idKaryawan" as DocumentKey,
                  note: "Format: JPG, JPEG, PNG, HEIC, HEIF, WEBP",
                },
                {
                  label: "SIM aktif *",
                  key: "simA" as DocumentKey,
                  note: "Format: JPG, JPEG, PNG, HEIC, HEIF, WEBP",
                },
                {
                  label: "Tiket Kereta PP (bagi wisatawan)",
                  key: "tiketKereta" as DocumentKey,
                  note: "Format: JPG, JPEG, PNG, HEIC, HEIF, WEBP",
                },
              ].map((doc) => (
                <div key={doc.key}>
                  <label className="block text-sm font-medium text-netral-900 mb-2">
                    {doc.label}
                  </label>
                  <div className="border-2 border-dashed border-netral-300 rounded-lg p-6 text-center hover:border-primary cursor-pointer flex flex-col items-center justify-center relative overflow-hidden">
                    {documents[doc.key].url ? (
                      <>
                        <img
                          src={documents[doc.key].url}
                          alt={`${doc.label} preview`}
                          className="w-full h-32 object-contain rounded"
                        />
                        <p className="text-xs text-netral-600 mt-3">
                          Klik untuk ganti dokumen
                        </p>
                      </>
                    ) : (
                      <>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="mb-2"
                        >
                          <path
                            d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                            stroke="#6D7280"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M17 8L12 3L7 8"
                            stroke="#6D7280"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 3V15"
                            stroke="#6D7280"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="text-xs text-netral-600">
                          Upload foto dokumen
                        </p>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/heic,image/heif,image/webp"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(event) =>
                        handleDocumentUpload(doc.key, event.target.files?.[0])
                      }
                      disabled={documents[doc.key].uploading}
                    />
                  </div>
                  {documents[doc.key].uploading && (
                    <p className="text-xs text-primary mt-1">
                      Mengunggah dokumen...
                    </p>
                  )}
                  {documents[doc.key].url && !documents[doc.key].uploading && (
                    <p className="text-xs text-green-600 mt-1">
                      Dokumen berhasil diunggah
                    </p>
                  )}
                  {documents[doc.key].error && (
                    <p className="text-xs text-red-500 mt-1">
                      {documents[doc.key].error}
                    </p>
                  )}
                  {doc.note && (
                    <p className="text-xs text-netral-500 mt-1">{doc.note}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Summary Section */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-lg border border-netral-200 sticky top-24">
          <h3 className="text-lg font-semibold text-netral-900 mb-5">
            Ringkasan Pesanan
          </h3>

          <div className="pb-5 border-b border-netral-200">
            <p className="text-sm font-medium text-netral-900">
              {kendaraanNama}
            </p>
            <p className="text-xs text-netral-600 mt-2">
              {dariTanggal}
              <br />
              {sampaiTanggal}
              <br />
              {hariSewa} hari
            </p>
          </div>

          <div className="space-y-3 mt-5 mb-5">
            <div className="flex justify-between text-sm">
              <span className="text-netral-600">Harga Kendaraan</span>
              <span className="font-medium text-netral-900">
                {convertRupiah(hargaSewa)}
              </span>
            </div>
            {formData.jenisSewa === "Dengan Sopir" && (
              <div className="flex justify-between text-sm">
                <span className="text-netral-600">Jasa Sopir</span>
                <span className="font-medium text-netral-900">
                  {convertRupiah(jesSodir)}
                </span>
              </div>
            )}
          </div>

          <div className="pt-5 border-t border-netral-200">
            <div className="flex justify-between items-center">
              <span className="text-netral-900 font-medium">Total Harga</span>
              <span className="text-2xl font-bold text-primary">
                {convertRupiah(
                  formData.jenisSewa === "Dengan Sopir"
                    ? totalDenganSopir
                    : hargaSewa
                )}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className={`w-full px-6 py-3 mt-6 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition-all duration-200 border-2 ${
              isUploadingDocs
                ? "opacity-70 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            style={{ backgroundColor: "#27C840", borderColor: "#27C840" }}
            disabled={isUploadingDocs}
            onMouseEnter={(e) => {
              if (isUploadingDocs) return;
              e.currentTarget.style.backgroundColor = "#1fa530";
            }}
            onMouseLeave={(e) => {
              if (isUploadingDocs) return;
              e.currentTarget.style.backgroundColor = "#27C840";
            }}
          >
            <svg
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.5833 4.66755C16.7428 3.81881 15.7418 3.14585 14.6386 2.68788C13.5353 2.22991 12.352 1.99609 11.1575 2.00005C6.1525 2.00005 2.07333 6.07922 2.07333 11.0842C2.07333 12.6884 2.495 14.2467 3.28333 15.6217L2 20.3334L6.8125 19.0684C8.14167 19.7925 9.63583 20.1775 11.1575 20.1775C16.1625 20.1775 20.2417 16.0984 20.2417 11.0934C20.2417 8.66422 19.2975 6.38172 17.5833 4.66755ZM11.1575 18.6375C9.80083 18.6375 8.47167 18.2709 7.3075 17.5834L7.0325 17.4184L4.1725 18.17L4.93333 15.3834L4.75 15.0992C3.99609 13.8957 3.59585 12.5044 3.595 11.0842C3.595 6.92255 6.98667 3.53088 11.1483 3.53088C13.165 3.53088 15.0625 4.31922 16.4833 5.74922C17.187 6.44942 17.7446 7.28238 18.1238 8.19977C18.5031 9.11715 18.6963 10.1007 18.6925 11.0934C18.7108 15.255 15.3192 18.6375 11.1575 18.6375ZM15.3008 12.9909C15.0717 12.8809 13.9533 12.3309 13.7517 12.2484C13.5408 12.175 13.3942 12.1384 13.2383 12.3584C13.0825 12.5875 12.6517 13.1009 12.5233 13.2475C12.395 13.4034 12.2575 13.4217 12.0283 13.3025C11.7992 13.1925 11.0658 12.945 10.2042 12.175C9.52583 11.57 9.07667 10.8275 8.93917 10.5984C8.81083 10.3692 8.92083 10.25 9.04 10.1309C9.14083 10.03 9.26917 9.86505 9.37917 9.73672C9.48917 9.60838 9.535 9.50755 9.60833 9.36088C9.68167 9.20505 9.645 9.07672 9.59 8.96672C9.535 8.85672 9.07667 7.73838 8.89333 7.28005C8.71 6.84005 8.5175 6.89505 8.38 6.88588H7.94C7.78417 6.88588 7.54583 6.94088 7.335 7.17005C7.13333 7.39922 6.54667 7.94922 6.54667 9.06755C6.54667 10.1859 7.3625 11.2675 7.4725 11.4142C7.5825 11.57 9.07667 13.8617 11.35 14.8425C11.8908 15.0809 12.3125 15.2184 12.6425 15.3192C13.1833 15.4934 13.6783 15.4659 14.0725 15.4109C14.5125 15.3467 15.42 14.8609 15.6033 14.3292C15.7958 13.7975 15.7958 13.3484 15.7317 13.2475C15.6675 13.1467 15.53 13.1009 15.3008 12.9909Z"
                fill="white"
              />
            </svg>
            Sewa via Whatsapp
          </button>
          <p className="text-xs text-netral-600 mt-3 text-center">
            Dengan melanjutkan, Anda akan diarahkan ke WhatsApp untuk konfirmasi
            pembayaran
          </p>
        </div>
      </div>
    </div>
  );
}
