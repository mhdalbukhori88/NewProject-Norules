import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/data";
import { requireAdminSession } from "@/lib/route-auth";

export async function GET() {
  await requireAdminSession();
  const data = await getDashboardData();
  return NextResponse.json(data);
}
