import React, { useState } from "react";
import { X, FolderPlus } from "lucide-react";

export default function CreateFolderModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#8b5cf6");

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate({ name: name.trim(), color });
    setName("");
    setColor("#8b5cf6");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md" onClick={onClose}>
      <div className="w-full max-w-sm rounded-3xl border border-violet-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950" onClick={e => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-950/50">
              <FolderPlus className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-black">New Folder</h2>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold">Folder name</label>
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              placeholder="Work, Personal, etc."
              className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 font-semibold outline-none focus:ring-2 focus:ring-violet-400 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold">Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={color} onChange={e => setColor(e.target.value)} className="h-12 w-16 cursor-pointer rounded-xl border border-zinc-200 dark:border-zinc-700" />
              <div className="flex-1 grid grid-cols-6 gap-2">
                {["#8b5cf6","#ec4899","#0ea5e9","#10b981","#f59e0b","#ef4444"].map(c => (
                  <button key={c} onClick={() => setColor(c)} className="h-8 w-8 rounded-lg border-2 border-white shadow" style={{background: c, outline: color===c ? '2px solid #7c3aed' : 'none'}} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-2xl border border-zinc-300 px-5 py-2.5 font-semibold hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">Cancel</button>
          <button onClick={handleCreate} disabled={!name.trim()} className="rounded-2xl bg-violet-600 px-5 py-2.5 font-semibold text-white hover:bg-violet-700 disabled:opacity-50">Create</button>
        </div>
      </div>
    </div>
  );
}
