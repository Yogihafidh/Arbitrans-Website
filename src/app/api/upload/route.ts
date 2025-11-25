import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { Buffer } from "node:buffer";
import { supabase } from "@/app/_libs/supabase";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/heic",
  "image/heif",
  "image/webp",
]);

const bucketMap = {
  ktpPenyewa: "ktpPenyewa",
  ktpPenjamin: "ktpPenjamin",
  idKaryawan: "idKaryawan",
  simA: "simA",
  tiketKereta: "tiketKereta",
} as const;

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");
  const docType = formData.get("type");

  if (!(file instanceof File) || typeof docType !== "string") {
    return NextResponse.json(
      { error: "File dan tipe dokumen wajib diisi." },
      { status: 400 }
    );
  }

  if (!bucketMap[docType as keyof typeof bucketMap]) {
    return NextResponse.json(
      { error: "Tipe dokumen tidak didukung." },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Ukuran file maksimal 5MB." },
      { status: 400 }
    );
  }

  if (file.type && !ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Format file tidak didukung." },
      { status: 400 }
    );
  }

  const bucketName = bucketMap[docType as keyof typeof bucketMap];
  const safeFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const fileName = `${docType}-${randomUUID()}-${safeFileName}`;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, Buffer.from(arrayBuffer), {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload file gagal:", uploadError);
      return NextResponse.json(
        { error: "Gagal mengunggah file, coba lagi." },
        { status: 500 }
      );
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);

    return NextResponse.json({ url: data.publicUrl });
  } catch (error) {
    console.error("Upload file gagal:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengunggah file." },
      { status: 500 }
    );
  }
}
