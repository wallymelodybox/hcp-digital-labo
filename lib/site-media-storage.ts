import { createClient } from "@supabase/supabase-js";

const bucketName = "site-media";
const manifestPath = "manifest/site-images.json";

function getStorageClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

async function ensureBucket() {
  const client = getStorageClient();
  if (!client) return null;

  const { data } = await client.storage.getBucket(bucketName);
  if (!data) {
    const { error } = await client.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 50 * 1024 * 1024,
      allowedMimeTypes: [
        "image/jpeg", "image/png", "image/webp", "image/gif", "image/avif",
        "video/mp4", "video/webm", "video/ogg", "video/quicktime",
        "application/json",
      ],
    });
    if (error && !/already exists/i.test(error.message)) throw error;
  }

  return client;
}

export function hasRemoteMediaStorage() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function readRemoteSiteImages() {
  const client = getStorageClient();
  if (!client) return null;

  const { data, error } = await client.storage.from(bucketName).download(manifestPath);
  if (error || !data) return null;

  try {
    const parsed: unknown = JSON.parse(await data.text());
    return parsed && typeof parsed === "object" ? parsed as Record<string, string> : null;
  } catch {
    return null;
  }
}

export async function writeRemoteSiteImages(images: Record<string, string>) {
  const client = await ensureBucket();
  if (!client) return false;

  const { error } = await client.storage.from(bucketName).upload(
    manifestPath,
    Buffer.from(JSON.stringify(images)),
    { contentType: "application/json", cacheControl: "0", upsert: true },
  );
  if (error) throw error;
  return true;
}

export async function uploadRemoteSiteMedia(
  key: string,
  bytes: Uint8Array,
  mimeType: string,
  extension: string,
) {
  const client = await ensureBucket();
  if (!client) return null;

  const objectPath = `${key}/${crypto.randomUUID()}.${extension}`;
  const { error } = await client.storage.from(bucketName).upload(objectPath, bytes, {
    contentType: mimeType,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;

  const { data } = client.storage.from(bucketName).getPublicUrl(objectPath);
  return { url: data.publicUrl, objectPath };
}

export async function removeRemoteSiteMedia(publicUrl: string) {
  const client = getStorageClient();
  const projectUrl = process.env.SUPABASE_URL;
  if (!client || !projectUrl) return;

  try {
    const url = new URL(publicUrl);
    if (url.origin !== new URL(projectUrl).origin) return;
    const marker = `/storage/v1/object/public/${bucketName}/`;
    if (!url.pathname.startsWith(marker)) return;
    const objectPath = decodeURIComponent(url.pathname.slice(marker.length));
    if (!objectPath || objectPath.includes("..")) return;
    await client.storage.from(bucketName).remove([objectPath]);
  } catch {
    // An invalid or already removed previous URL does not block replacement.
  }
}

