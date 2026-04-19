import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { sessionCookieName } from "@/lib/session";

export async function POST() {
  cookies().delete(sessionCookieName);
  return NextResponse.json({ message: "Logout berhasil." });
}
