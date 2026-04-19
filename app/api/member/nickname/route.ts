import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getPool, isDbConfigured, query } from "@/lib/db";
import { requireMemberSession } from "@/lib/route-auth";
import { createMemberToken, memberSessionCookieName } from "@/lib/session";

const nicknameSchema = z.object({
  nickname: z.string().min(3)
});

export async function PATCH(request: Request) {
  try {
    const session = await requireMemberSession();
    const payload = nicknameSchema.parse(await request.json());

    if (!isDbConfigured()) {
      return NextResponse.json({ message: "Mode demo aktif." });
    }

    const rows = await query<{ id: string }>(
      "SELECT id FROM members WHERE nickname = ? AND id <> ? LIMIT 1",
      [payload.nickname, session.id]
    );

    if (rows.length > 0) {
      return NextResponse.json(
        { message: "Nickname sudah dipakai member lain." },
        { status: 400 }
      );
    }

    await getPool().execute("UPDATE members SET nickname = ? WHERE id = ?", [
      payload.nickname,
      session.id
    ]);

    const token = await createMemberToken({
      id: session.id,
      nickname: payload.nickname
    });

    cookies().set(memberSessionCookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });

    revalidatePath("/members");
    revalidatePath(`/members/${session.id}`);
    revalidatePath("/member/account");

    return NextResponse.json({ message: "Nickname berhasil diperbarui." });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Terjadi kesalahan." },
      { status: 400 }
    );
  }
}
