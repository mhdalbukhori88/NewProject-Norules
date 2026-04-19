import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { memberSessionCookieName } from "@/lib/session";

export async function POST() {
  cookies().delete(memberSessionCookieName);
  return NextResponse.json({ message: "Logout member berhasil." });
}
