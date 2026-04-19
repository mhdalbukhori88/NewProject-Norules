import { NextResponse } from "next/server";
import { saveUploadedFile } from "@/lib/upload";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") || "general");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "File tidak ditemukan." }, { status: 400 });
    }

    const url = await saveUploadedFile(file, folder);
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Upload gagal." },
      { status: 400 }
    );
  }
}
