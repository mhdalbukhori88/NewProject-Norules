import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getPool, isDbConfigured, query } from "@/lib/db";
import { requireAdminSession } from "@/lib/route-auth";

const memberSchema = z.object({
  nama: z.string().min(3),
  nickname: z.string().min(3),
  gender: z.string().nullable().optional(),
  tanggal_lahir: z.string().nullable().optional(),
  domisili: z.string().nullable().optional(),
  no_hp: z.string().nullable().optional(),
  division: z.string().nullable().optional(),
  role: z.string().min(1),
  photo_url: z.string().nullable().optional(),
  status: z.string().min(1),
  password: z.string().min(6).optional().or(z.literal(""))
});

const updateSchema = memberSchema.extend({
  id: z.string().min(1)
});

const statusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["approved", "pending", "blacklist", "warning", "rejected"])
});

export async function GET() {
  await requireAdminSession();
  if (!isDbConfigured()) {
    return NextResponse.json([]);
  }

  const rows = await query("SELECT * FROM members ORDER BY created_at DESC");
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  try {
    await requireAdminSession();
    const payload = memberSchema.parse(await request.json());
    if (!isDbConfigured()) {
      return NextResponse.json({ message: "Mode demo aktif." });
    }

    const existing = await query<{ id: string }>(
      "SELECT id FROM members WHERE nickname = ? LIMIT 1",
      [payload.nickname]
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { message: "Nickname sudah dipakai member lain." },
        { status: 400 }
      );
    }

    const passwordHash = payload.password
      ? await bcrypt.hash(payload.password, 10)
      : null;

    await getPool().execute(
      "INSERT INTO members (id, nama, nickname, gender, tanggal_lahir, domisili, no_hp, division, role, photo_url, member_password_hash, status, join_date, created_at) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), NOW())",
      [
        payload.nama,
        payload.nickname,
        payload.gender || null,
        payload.tanggal_lahir || null,
        payload.domisili || null,
        payload.no_hp || null,
        payload.division || null,
        payload.role,
        payload.photo_url || null,
        passwordHash,
        payload.status
      ]
    );

    revalidatePath("/");
    revalidatePath("/members");
    revalidatePath("/admin");
    return NextResponse.json({ message: "Member ditambahkan." });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Terjadi kesalahan." }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdminSession();
    const payload = updateSchema.parse(await request.json());
    if (!isDbConfigured()) {
      return NextResponse.json({ message: "Mode demo aktif." });
    }

    const existing = await query<{ id: string }>(
      "SELECT id FROM members WHERE nickname = ? AND id <> ? LIMIT 1",
      [payload.nickname, payload.id]
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { message: "Nickname sudah dipakai member lain." },
        { status: 400 }
      );
    }

    const passwordHash = payload.password
      ? await bcrypt.hash(payload.password, 10)
      : null;

    if (passwordHash) {
      await getPool().execute(
        "UPDATE members SET nama=?, nickname=?, gender=?, tanggal_lahir=?, domisili=?, no_hp=?, division=?, role=?, photo_url=?, member_password_hash=?, status=? WHERE id=?",
        [
          payload.nama,
          payload.nickname,
          payload.gender || null,
          payload.tanggal_lahir || null,
          payload.domisili || null,
          payload.no_hp || null,
          payload.division || null,
          payload.role,
          payload.photo_url || null,
          passwordHash,
          payload.status,
          payload.id
        ]
      );
    } else {
      await getPool().execute(
        "UPDATE members SET nama=?, nickname=?, gender=?, tanggal_lahir=?, domisili=?, no_hp=?, division=?, role=?, photo_url=?, status=? WHERE id=?",
        [
          payload.nama,
          payload.nickname,
          payload.gender || null,
          payload.tanggal_lahir || null,
          payload.domisili || null,
          payload.no_hp || null,
          payload.division || null,
          payload.role,
          payload.photo_url || null,
          payload.status,
          payload.id
        ]
      );
    }

    revalidatePath("/");
    revalidatePath("/members");
    revalidatePath("/admin");
    return NextResponse.json({ message: "Member diperbarui." });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Terjadi kesalahan." }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdminSession();
    const payload = statusSchema.parse(await request.json());
    if (!isDbConfigured()) {
      return NextResponse.json({ message: "Mode demo aktif." });
    }

    await getPool().execute("UPDATE members SET status=? WHERE id=?", [
      payload.status,
      payload.id
    ]);

    revalidatePath("/");
    revalidatePath("/members");
    revalidatePath("/admin");
    return NextResponse.json({ message: "Status member diperbarui." });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Terjadi kesalahan." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdminSession();
    const { id } = z.object({ id: z.string().min(1) }).parse(await request.json());
    if (!isDbConfigured()) {
      return NextResponse.json({ message: "Mode demo aktif." });
    }

    await getPool().execute("DELETE FROM members WHERE id = ?", [id]);
    revalidatePath("/");
    revalidatePath("/members");
    revalidatePath("/admin");
    return NextResponse.json({ message: "Member dihapus." });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Terjadi kesalahan." }, { status: 400 });
  }
}
