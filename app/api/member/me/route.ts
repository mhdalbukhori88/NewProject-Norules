import { NextResponse } from "next/server";
import { getMemberById } from "@/lib/data";
import { requireMemberSession } from "@/lib/route-auth";

export async function GET() {
  try {
    const session = await requireMemberSession();
    const member = await getMemberById(session.id);

    if (!member) {
      return NextResponse.json({ message: "Member tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Terjadi kesalahan." },
      { status: 401 }
    );
  }
}
