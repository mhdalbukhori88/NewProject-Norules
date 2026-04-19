import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateAdmin } from "@/lib/data";
import { createAdminToken, sessionCookieName } from "@/lib/session";

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(3),
  remember: z.boolean().optional()
});

export async function POST(request: Request) {
  try {
    const payload = loginSchema.parse(await request.json());
    const admin = await authenticateAdmin(payload.username, payload.password);

    if (!admin) {
      return NextResponse.json({ message: "Username atau password salah." }, { status: 401 });
    }

    const token = await createAdminToken(admin);

    cookies().set(sessionCookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: payload.remember ? 60 * 60 * 24 * 7 : 60 * 60 * 6
    });

    return NextResponse.json({ message: "Login berhasil." });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Terjadi kesalahan." },
      { status: 400 }
    );
  }
}
