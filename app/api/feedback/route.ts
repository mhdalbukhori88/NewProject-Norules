import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getPool, isDbConfigured, query } from "@/lib/db";
import { requireAdminSession } from "@/lib/route-auth";

const createSchema = z.object({
  name: z.string().max(100).optional().or(z.literal("")),
  category: z.enum(["Kritik", "Saran", "Pengaduan"]),
  message: z.string().min(8).max(2000)
});

const updateSchema = z.object({
  id: z.string().min(1),
  is_read: z.boolean().optional()
});

const deleteSchema = z.object({
  id: z.string().min(1)
});

export async function GET() {
  await requireAdminSession();
  if (!isDbConfigured()) {
    return NextResponse.json([]);
  }

  const rows = await query(
    "SELECT * FROM feedback ORDER BY is_read ASC, created_at DESC"
  );
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  try {
    const payload = createSchema.parse(await request.json());

    if (!isDbConfigured()) {
      return NextResponse.json({
        message: "Mode demo aktif. Hubungkan MySQL untuk menyimpan feedback."
      });
    }

    await getPool().execute(
      "INSERT INTO feedback (id, name, category, message, is_read, created_at) VALUES (UUID(), ?, ?, ?, 0, NOW())",
      [payload.name || null, payload.category, payload.message]
    );

    revalidatePath("/");
    revalidatePath("/admin");
    return NextResponse.json({ message: "Feedback tersimpan." });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Terjadi kesalahan." },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdminSession();
    const payload = updateSchema.parse(await request.json());

    if (!isDbConfigured()) {
      return NextResponse.json({ message: "Mode demo aktif." });
    }

    await getPool().execute("UPDATE feedback SET is_read = ? WHERE id = ?", [
      payload.is_read ? 1 : 0,
      payload.id
    ]);

    revalidatePath("/admin");
    return NextResponse.json({ message: "Feedback diperbarui." });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Terjadi kesalahan." },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdminSession();
    const payload = deleteSchema.parse(await request.json());

    if (!isDbConfigured()) {
      return NextResponse.json({ message: "Mode demo aktif." });
    }

    await getPool().execute("DELETE FROM feedback WHERE id = ?", [payload.id]);
    revalidatePath("/admin");
    return NextResponse.json({ message: "Feedback dihapus." });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Terjadi kesalahan." },
      { status: 400 }
    );
  }
}
