import React, { useState, useEffect } from "react";
import { X, Folder, BookOpen, Archive, Star, Heart, Briefcase, Code2, Music, Camera, Globe, Check } from "lucide-react";

const FOLDER_COLORS = [
  { hex: "#8b5cf6", name: "Violet" }, { hex: "#ec4899", name: "Pink" },
  { hex: "#0ea5e9", name: "Sky" }, { hex: "#10b981", name: "Emerald" },
  { hex: "#f59e0b", name: "Amber" }, { hex: "#ef4444", name: "Red" },
  { hex: "#6366f1", name: "Indigo" }, { hex: "#14b8a6", name: "Teal" },
  { hex: "#f97316", name: "Orange" }, { hex: "#a855f7", name: "Purple" },
  { hex: "#64748b", name: "Slate" }, { hex: "#78716c", name: "Stone" },
];

const FOLDER_ICONS = [
  { icon: Folder, name: "Folder" }, { icon: BookOpen, name: "Book" },
  { icon: Archive, name: "Archive" }, { icon: Star, name: "Star" },
  { icon: Heart, name: "Heart" }, { icon: Briefcase, name: "Work" },
  { icon: Code2, name: "Code" }, { icon: Music, name: "Music" },
  { icon: Camera, name: "Photo" }, { icon: Globe, name: "Web" },
];

export default function EditFolderModal({ isOpen, onClose, folder, onSave, onDelete }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#8b5cf6");
  const [icon, setIcon] = useState("Folder");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (folder) { setName(folder.name || ""); setColor(folder.color || "#8b5cf6"); setIcon(folder.icon || "Folder"); setConfirmDelete(false); }
  }, [folder, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); onSave({ ...folder, name: name.trim(), color, icon }); onClose(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose, onSave, folder, name, color, icon]);

  if (!isOpen || !folder) return null;
  const SelectedIcon = FOLDER_ICONS.find((i) => i.name === icon)?.icon || Folder;

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: color + "20" }}><SelectedIcon size={20} style={{ color }} /></div>
            <div><h2 className="text-lg font-bold text-zinc-900 dark:text-white">Edit Folder</h2><p className="text-xs text-zinc-400">Customize your folder</p></div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-zinc-400 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"><X size={18} /></button>
        </div>
        {/* Body */}
        <div className="space-y-5 px-6 py-5">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} autoFocus className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-800" placeholder="Folder name" />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">Color</label>
            <div className="grid grid-cols-6 gap-2">
              {FOLDER_COLORS.map((c) => (
                <button key={c.hex} onClick={() => setColor(c.hex)} className="group relative flex h-10 items-center justify-center rounded-xl border-2 transition hover:scale-105" style={{ background: c.hex, borderColor: color === c.hex ? "#fff" : "transparent", boxShadow: color === c.hex ? `0 0 0 2px ${c.hex}` : "none" }} title={c.name}>
                  {color === c.hex && <Check size={16} className="text-white" />}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">Icon</label>
            <div className="grid grid-cols-5 gap-2">
              {FOLDER_ICONS.map((item) => (
                <button key={item.name} onClick={() => setIcon(item.name)} className={`flex flex-col items-center gap-1 rounded-xl border-2 px-2 py-2.5 text-[10px] font-semibold transition hover:bg-zinc-50 dark:hover:bg-zinc-800 ${icon === item.name ? "border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300" : "border-zinc-200 text-zinc-500 dark:border-zinc-700"}`}>
                  <item.icon size={18} />{item.name}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-red-600">Danger Zone</p>
            {!confirmDelete ? (
              <button onClick={() => setConfirmDelete(true)} className="text-sm font-semibold text-red-600 hover:underline">Delete this folder...</button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-600">Are you sure?</span>
                <button onClick={() => { onDelete(folder.id); onClose(); }} className="rounded-xl bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700">Yes, delete</button>
                <button onClick={() => setConfirmDelete(false)} className="text-xs font-semibold text-zinc-500 hover:underline">Cancel</button>
              </div>
            )}
          </div>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <p className="text-[11px] text-zinc-400"><kbd className="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-zinc-700 dark:bg-zinc-800">⌘ Enter</kbd> to save</p>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-2xl px-5 py-2.5 text-sm font-semibold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">Cancel</button>
            <button onClick={() => { onSave({ ...folder, name: name.trim(), color, icon }); onClose(); }} className="rounded-2xl bg-violet-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-200 hover:bg-violet-700 dark:shadow-violet-900/30">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
