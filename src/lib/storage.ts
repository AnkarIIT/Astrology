import { getSupabase } from "./supabase";

const BUCKET = "media";

export function isStorageConfigured(): boolean {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
  );
}

/**
 * Upload a file to Supabase Storage ("media" bucket) and return its public URL.
 */
export async function uploadFile(file: File, folder: string): Promise<string> {
  const sb = getSupabase();
  const ext = file.name.split(".").pop() || "bin";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const path = `${folder}/${safeName}`;

  const { error } = await sb.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) {
    // Fallback: attempt public upload path if bucket policy differs
    throw new Error(error.message);
  }

  const { data } = sb.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteFileFromUrl(url: string): Promise<void> {
  if (!url) return;
  try {
    const path = new URL(url).pathname.split(`/${BUCKET}/`)[1];
    if (!path) return;
    await getSupabase().storage.from(BUCKET).remove([path]);
  } catch {
    // non-storage URLs (external) are ignored
  }
}
