import React, { useState, useEffect } from "react";
import { X, Shield, Camera, Upload, User as UserIcon, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { uploadImage } from "../lib/upload";

export default function AccountSettingsModal({ isOpen, onClose, user, onSave, onDelete }) {
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (isOpen) { setName(user?.name || ""); setAvatar(user?.avatar || ""); setConfirmDelete(false); }
  }, [isOpen, user]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); handleSave(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user?.id) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (error) throw error;
      const url = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
      setAvatar(url + `?t=${Date.now()}`);
    } catch (err) { alert("Upload failed: " + err.message); }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ data: { full_name: name, avatar_url: avatar } });
    setSaving(false);
    if (error) return alert(error.message);
    onSave?.({ ...user, name, avatar });
    onClose();
  };

  const initials = (name || "U").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900" style={{ maxHeight: "90vh" }}>
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Account Settings</h2>
          <button onClick={onClose} className="rounded-xl p-2 text-zinc-400 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"><X size={18} /></button>
        </div>
        <div className="max-h-[65vh] space-y-6 overflow-y-auto px-6 py-5">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="group relative">
              {avatar ? (
                <img src={avatar} alt="avatar" className="h-24 w-24 rounded-full border-4 border-violet-100 object-cover dark:border-zinc-700" />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-violet-100 bg-gradient-to-br from-violet-500 to-violet-700 text-2xl font-bold text-white dark:border-zinc-700">{initials}</div>
              )}
              <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-violet-600 text-white shadow-lg transition hover:bg-violet-700">
                <Camera size={14} /><input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            </div>
            <p className="mt-2 text-xs text-zinc-400">{uploading ? "Uploading..." : "Click camera to change"}</p>
            {avatar && <button onClick={() => setAvatar("")} className="mt-1 text-xs text-red-500 hover:underline">Remove photo</button>}
          </div>
          {/* Name */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">Display Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-800" placeholder="Your name" />
          </div>
          {/* Email */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">Email</label>
            <input value={user?.email || ""} readOnly className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950" />
            <p className="mt-1 text-xs text-zinc-400">Email is managed by your login provider</p>
          </div>
          {/* Danger */}
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
            <div className="mb-2 flex items-center gap-1.5"><Shield size={14} className="text-red-600" /><p className="text-xs font-bold uppercase tracking-wider text-red-600">Danger Zone</p></div>
            {!confirmDelete ? (
              <button onClick={() => setConfirmDelete(true)} className="text-sm font-semibold text-red-600 hover:underline">Delete account and all data...</button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-red-600">This will permanently delete your account and all data. Cannot be undone.</p>
                <div className="flex gap-2">
                  <button onClick={() => { onDelete?.(); onClose(); }} className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700">Yes, delete everything</button>
                  <button onClick={() => setConfirmDelete(false)} className="text-xs font-semibold text-zinc-500 hover:underline">Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <button onClick={onClose} className="rounded-2xl px-5 py-2.5 text-sm font-semibold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="rounded-2xl bg-violet-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:opacity-50 dark:shadow-violet-900/30">{saving ? "Saving..." : "Save"}</button>
        </div>
      </div>
    </div>
  );
}
