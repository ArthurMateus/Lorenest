import React, { useState, useEffect } from "react";
import { X, Edit3 } from "lucide-react";

export default function RenameModal({ isOpen, onClose, onRename, initialName = "", title = "Rename" }) {
  const [name, setName] = useState(initialName);

  useEffect(() => { setName(initialName); }, [initialName, isOpen]);

  if (!isOpen) return null;

  const handleRename = () => {
    if (!name.trim()) return;
    onRename(name.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md" onClick={onClose}>
      <div className="w-full max-w-sm rounded-3xl border border-violet-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950" onClick={e => e.stopPropagation()}>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-950/50">
            <Edit3 className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-black">{title}</h2>
          <button onClick={onClose} className="ml-auto rounded-xl p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <input
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleRename()}
          className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 font-semibold outline-none focus:ring-2 focus:ring-violet-400 dark:border-zinc-700 dark:bg-zinc-900"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-2xl border border-zinc-300 px-5 py-2.5 font-semibold hover:bg-zinc-50 dark:border-zinc-700">Cancel</button>
          <button onClick={handleRename} disabled={!name.trim()} className="rounded-2xl bg-violet-600 px-5 py-2.5 font-semibold text-white hover:bg-violet-700 disabled:opacity-50">Save</button>
        </div>
      </div>
    </div>
  );
}
