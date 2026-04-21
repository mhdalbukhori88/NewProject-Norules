import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { put } from "@vercel/blob";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg"
]);

function normalizeFolder(folder: string) {
  const cleaned = folder.trim().toLowerCase().replace(/[^a-z0-9/-]+/g, "-");
  return cleaned || "general";
}

function buildFileName(file: File) {
  const baseName = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-");
  const safeBaseName = baseName.replace(/^-+|-+$/g, "") || "upload";
  const extension = file.name.split(".").pop()?.toLowerCase() || "png";

  return `${safeBaseName}.${extension}`;
}

export async function saveUploadedFile(file: File, folder: string) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Format file harus JPG, JPEG, PNG, atau WEBP.");
  }

  const safeFolder = normalizeFolder(folder);
  const fileName = buildFileName(file);

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`${safeFolder}/${fileName}`, file, {
      access: "public",
      addRandomSuffix: true
    });

    return blob.url;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Upload production memerlukan Vercel Blob. Tambahkan BLOB_READ_WRITE_TOKEN di project Vercel."
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = file.name.split(".").pop()?.toLowerCase() || "png";
  const localFileName = `${randomUUID()}.${extension}`;
  const targetDir = path.join(process.cwd(), "public", "uploads", safeFolder);
  const targetPath = path.join(targetDir, localFileName);

  await mkdir(targetDir, { recursive: true });
  await writeFile(targetPath, buffer);

  return `/uploads/${safeFolder}/${localFileName}`;
}
