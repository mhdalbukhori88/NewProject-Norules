import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getPool, isDbConfigured, query } from "@/lib/db";
import { requireAdminSession } from "@/lib/route-auth";

const testerSchema = z.object({
  nama: z.string().min(3),
  whatsapp: z.string().min(8),
  is_online: z.boolean()
});

export async function GET() {
  await requireAdminSession();
  if (!isDbConfigured()) return NextResponse.json([]);
  const rows = await query("SELECT * FROM testers ORDER BY is_online DESC, nama ASC");
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  try {
    await requireAdminSession();
    const payload = testerSchema.parse(await request.json());
    if (!isDbConfigured()) return NextResponse.json({ message: "Mode demo aktif." });
    await getPool().execute(
      "INSERT INTO testers (id, nama, whatsapp, is_online, created_at) VALUES (UUID(), ?, ?, ?, NOW())",
      [payload.nama, payload.whatsapp, payload.is_online ? 1 : 0]
    );
    revalidatePath("/");
    revalidatePath("/admin");
    return NextResponse.json({ message: "Tester ditambahkan." });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Terjadi kesalahan." }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdminSession();
    const payload = testerSchema.extend({ id: z.string().min(1) }).parse(await request.json());
    if (!isDbConfigured()) return NextResponse.json({ message: "Mode demo aktif." });
    await getPool().execute(
      "UPDATE testers SET nama=?, whatsapp=?, is_online=? WHERE id=?",
      [payload.nama, payload.whatsapp, payload.is_online ? 1 : 0, payload.id]
    );
    revalidatePath("/");
    revalidatePath("/admin");
    return NextResponse.json({ message: "Tester diperbarui." });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Terjadi kesalahan." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdminSession();
    const { id } = z.object({ id: z.string().min(1) }).parse(await request.json());
    if (!isDbConfigured()) return NextResponse.json({ message: "Mode demo aktif." });
    await getPool().execute("DELETE FROM testers WHERE id = ?", [id]);
    revalidatePath("/");
    revalidatePath("/admin");
    return NextResponse.json({ message: "Tester dihapus." });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Terjadi kesalahan." }, { status: 400 });
  }
}
