import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getPool, isDbConfigured, query } from "@/lib/db";
import { requireAdminSession } from "@/lib/route-auth";

const blacklistSchema = z.object({
  nama: z.string().min(3),
  nickname: z.string().min(3),
  status: z.string().min(1),
  durasi: z.string().min(1),
  alasan: z.string().nullable().optional()
});

export async function GET() {
  await requireAdminSession();
  if (!isDbConfigured()) return NextResponse.json([]);
  const rows = await query("SELECT * FROM blacklist ORDER BY created_at DESC");
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  try {
    await requireAdminSession();
    const payload = blacklistSchema.parse(await request.json());
    if (!isDbConfigured()) return NextResponse.json({ message: "Mode demo aktif." });
    await getPool().execute(
      "INSERT INTO blacklist (id, nama, nickname, status, durasi, alasan, created_at) VALUES (UUID(), ?, ?, ?, ?, ?, NOW())",
      [payload.nama, payload.nickname, payload.status, payload.durasi, payload.alasan || null]
    );
    revalidatePath("/blacklist");
    revalidatePath("/admin");
    return NextResponse.json({ message: "Entry blacklist ditambahkan." });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Terjadi kesalahan." }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdminSession();
    const payload = blacklistSchema.extend({ id: z.string().min(1) }).parse(await request.json());
    if (!isDbConfigured()) return NextResponse.json({ message: "Mode demo aktif." });
    await getPool().execute(
      "UPDATE blacklist SET nama=?, nickname=?, status=?, durasi=?, alasan=? WHERE id=?",
      [payload.nama, payload.nickname, payload.status, payload.durasi, payload.alasan || null, payload.id]
    );
    revalidatePath("/blacklist");
    revalidatePath("/admin");
    return NextResponse.json({ message: "Entry blacklist diperbarui." });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Terjadi kesalahan." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdminSession();
    const { id } = z.object({ id: z.string().min(1) }).parse(await request.json());
    if (!isDbConfigured()) return NextResponse.json({ message: "Mode demo aktif." });
    await getPool().execute("DELETE FROM blacklist WHERE id = ?", [id]);
    revalidatePath("/blacklist");
    revalidatePath("/admin");
    return NextResponse.json({ message: "Entry blacklist dihapus." });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Terjadi kesalahan." }, { status: 400 });
  }
}
