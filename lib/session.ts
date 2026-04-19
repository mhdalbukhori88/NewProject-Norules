import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "norules_admin_session";
const MEMBER_COOKIE_NAME = "norules_member_session";
const DEV_FALLBACK_SECRET = "norules-community-local-dev-secret-2026";

export function getJwtSecret() {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  if (process.env.NODE_ENV !== "production") {
    return DEV_FALLBACK_SECRET;
  }

  throw new Error("JWT_SECRET belum diatur pada environment production.");
}

function getSecret() {
  return new TextEncoder().encode(getJwtSecret());
}

export async function createAdminToken(payload: { id: string; username: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyAdminToken(token: string) {
  const result = await jwtVerify(token, getSecret());
  return result.payload as { id: string; username: string };
}

export const sessionCookieName = COOKIE_NAME;

export async function createMemberToken(payload: { id: string; nickname: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyMemberToken(token: string) {
  const result = await jwtVerify(token, getSecret());
  return result.payload as { id: string; nickname: string };
}

export const memberSessionCookieName = MEMBER_COOKIE_NAME;
