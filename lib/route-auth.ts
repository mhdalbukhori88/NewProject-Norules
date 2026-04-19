import { cookies } from "next/headers";
import {
  memberSessionCookieName,
  sessionCookieName,
  verifyAdminToken,
  verifyMemberToken
} from "@/lib/session";

export async function requireAdminSession() {
  const token = cookies().get(sessionCookieName)?.value;

  if (!token) {
    throw new Error("Akses admin ditolak.");
  }

  await verifyAdminToken(token);
}

export async function requireMemberSession() {
  const token = cookies().get(memberSessionCookieName)?.value;

  if (!token) {
    throw new Error("Akses member ditolak.");
  }

  return verifyMemberToken(token);
}
