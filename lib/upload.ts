import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg"
]);

export async function saveUploadedFile(file: File, folder: string) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Format file harus JPG, JPEG, PNG, atau WEBP.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = file.name.split(".").pop()?.toLowerCase() || "png";
  const fileName = `${randomUUID()}.${extension}`;
  const targetDir = path.join(process.cwd(), "public", "uploads", folder);
  const targetPath = path.join(targetDir, fileName);

  await mkdir(targetDir, { recursive: true });
  await writeFile(targetPath, buffer);

  return `/uploads/${folder}/${fileName}`;
}
