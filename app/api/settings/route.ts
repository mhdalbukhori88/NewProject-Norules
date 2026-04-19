import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getPool, isDbConfigured } from "@/lib/db";
import { requireAdminSession } from "@/lib/route-auth";

const settingsSchema = z.object({
  recruitmentStatus: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  password: z.string().min(6).optional()
});

export async function PATCH(request: Request) {
  try {
    await requireAdminSession();
    const payload = settingsSchema.parse(await request.json());
    if (!isDbConfigured()) return NextResponse.json({ message: "Mode demo aktif." });

    if (payload.recruitmentStatus) {
      await getPool().execute(
        "INSERT INTO settings (`key`, `value`) VALUES ('recruitment_status', ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)",
        [payload.recruitmentStatus]
      );
    }

    if (payload.password) {
      const hash = await bcrypt.hash(payload.password, 10);
      await getPool().execute(
        "UPDATE admins SET password_hash = ? WHERE username = 'admin'",
        [hash]
      );
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return NextResponse.json({ message: "Pengaturan diperbarui." });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Terjadi kesalahan." }, { status: 400 });
  }
}
