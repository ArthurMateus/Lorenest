import { supabase } from "./supabase";

export async function uploadImage(file, userId) {
  if (!file || !userId) throw new Error("Missing file or user");
  const ext = file.name.split('.').pop();
  const path = `${userId}/${Date.now()}.${ext}`;
  
  const { error } = await supabase.storage
    .from('card-images')
    .upload(path, file, { cacheControl: '3600', upsert: false });
  
  if (error) throw error;
  
  const { data } = supabase.storage.from('card-images').getPublicUrl(path);
  return data.publicUrl;
}