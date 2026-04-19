import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getPool, isDbConfigured, query } from "@/lib/db";
import { requireAdminSession } from "@/lib/route-auth";

const eventSchema = z.object({
  title: z.string().min(3),
  description: z.string().nullable().optional(),
  event_date: z.string().min(1),
  banner_url: z.string().nullable().optional()
});

export async function GET() {
  if (!isDbConfigured()) return NextResponse.json([]);
  const rows = await query("SELECT * FROM events ORDER BY event_date ASC");
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  try {
    await requireAdminSession();
    const payload = eventSchema.parse(await request.json());
    if (!isDbConfigured()) return NextResponse.json({ message: "Mode demo aktif." });
    await getPool().execute(
      "INSERT INTO events (id, title, description, event_date, banner_url, created_at) VALUES (UUID(), ?, ?, ?, ?, NOW())",
      [payload.title, payload.description || null, payload.event_date, payload.banner_url || null]
    );
    revalidatePath("/");
    revalidatePath("/admin");
    return NextResponse.json({ message: "Event ditambahkan." });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Terjadi kesalahan." }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdminSession();
    const payload = eventSchema.extend({ id: z.string().min(1) }).parse(await request.json());
    if (!isDbConfigured()) return NextResponse.json({ message: "Mode demo aktif." });
    await getPool().execute(
      "UPDATE events SET title=?, description=?, event_date=?, banner_url=? WHERE id=?",
      [payload.title, payload.description || null, payload.event_date, payload.banner_url || null, payload.id]
    );
    revalidatePath("/");
    revalidatePath("/admin");
    return NextResponse.json({ message: "Event diperbarui." });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Terjadi kesalahan." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdminSession();
    const { id } = z.object({ id: z.string().min(1) }).parse(await request.json());
    if (!isDbConfigured()) return NextResponse.json({ message: "Mode demo aktif." });
    await getPool().execute("DELETE FROM events WHERE id = ?", [id]);
    revalidatePath("/");
    revalidatePath("/admin");
    return NextResponse.json({ message: "Event dihapus." });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Terjadi kesalahan." }, { status: 400 });
  }
}
