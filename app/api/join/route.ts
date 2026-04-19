import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getPool, isDbConfigured, query } from "@/lib/db";

const joinSchema = z.object({
  nama: z.string().min(3),
  nickname: z.string().min(3),
  gender: z.string().min(1),
  tanggal_lahir: z.string().min(1),
  domisili: z.string().min(2),
  no_hp: z.string().min(8),
  division: z.string().min(1),
  role: z.string().min(1),
  photo_url: z.string().min(10),
  password: z.string().min(6)
});

export async function POST(request: Request) {
  try {
    const payload = joinSchema.parse(await request.json());

    if (!isDbConfigured()) {
      return NextResponse.json({
        message: "Mode demo aktif. Hubungkan MySQL untuk menyimpan pendaftaran."
      });
    }

    const existing = await query<{ id: string }>(
      "SELECT id FROM members WHERE nickname = ? LIMIT 1",
      [payload.nickname]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "Nickname sudah dipakai, silakan gunakan nickname lain." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);

    await getPool().execute(
      "INSERT INTO members (id, nama, nickname, gender, tanggal_lahir, domisili, no_hp, division, role, photo_url, member_password_hash, status, join_date, created_at) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', CURDATE(), NOW())",
      [
        payload.nama,
        payload.nickname,
        payload.gender,
        payload.tanggal_lahir,
        payload.domisili,
        payload.no_hp,
        payload.division,
        payload.role,
        payload.photo_url,
        passwordHash
      ]
    );

    revalidatePath("/");
    revalidatePath("/members");
    revalidatePath("/admin");

    return NextResponse.json({ message: "Pendaftaran berhasil dikirim." });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Terjadi kesalahan." },
      { status: 400 }
    );
  }
}
