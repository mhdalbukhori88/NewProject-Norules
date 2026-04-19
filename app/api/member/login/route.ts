import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateMember } from "@/lib/data";
import { createMemberToken, memberSessionCookieName } from "@/lib/session";

const loginSchema = z.object({
  nickname: z.string().min(3),
  password: z.string().min(6),
  remember: z.boolean().optional()
});

export async function POST(request: Request) {
  try {
    const payload = loginSchema.parse(await request.json());
    const member = await authenticateMember(payload.nickname, payload.password);

    if (!member) {
      return NextResponse.json(
        { message: "Nickname atau password member salah." },
        { status: 401 }
      );
    }

    const token = await createMemberToken({
      id: member.id,
      nickname: member.nickname
    });

    cookies().set(memberSessionCookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: payload.remember ? 60 * 60 * 24 * 7 : 60 * 60 * 6
    });

    return NextResponse.json({ message: "Login member berhasil.", member });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Terjadi kesalahan." },
      { status: 400 }
    );
  }
}
