import React, { useState, useEffect } from "react";
import { X, FolderPlus, Palette } from "lucide-react";

const presetPalettes = [
  { name: "Violet Dream", primary: "#7c3aed", secondary: "#a855f7", accent: "#ec4899" },
  { name: "Ocean", primary: "#0ea5e9", secondary: "#06b6d4", accent: "#3b82f6" },
  { name: "Forest", primary: "#059669", secondary: "#10b981", accent: "#84cc16" },
  { name: "Sunset", primary: "#ea580c", secondary: "#f97316", accent: "#eab308" },
  { name: "Midnight", primary: "#1e1b4b", secondary: "#312e81", accent: "#6366f1" },
];

export default function CreateProjectModal({ isOpen, onClose, folders, onCreate }) {
  const [name, setName] = useState("");
  const [folderId, setFolderId] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(presetPalettes[0]);
  const [custom, setCustom] = useState({ primary: "#7c3aed", secondary: "#a855f7", accent: "#ec4899" });
  const [useCustom, setUseCustom] = useState(false);

  // Update folderId when folders change or modal opens
  useEffect(() => {
    if (isOpen) {
      setFolderId(folders[0]?.id || "");
      setName("");
    }
  }, [isOpen, folders]);

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!name.trim()) return;
    const palette = useCustom? custom : selectedPreset;
    onCreate({
      id: `project-${Date.now()}`,
      name: name.trim(),
      folderId: folderId || undefined, // ← will trigger auto-folder creation
      palette: {
        primary: palette.primary,
        secondary: palette.secondary,
        accent: palette.accent,
        background: "#f5f3ff",
      },
      status: "Planning",
      starred: false,
      boards: [{ id: `board-${Date.now()}`, name: "Main Board", cards: [] }]
    });
    onClose();
  };

  const palette = useCustom? custom : selectedPreset;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md" onClick={onClose}>
      <div className="w-full max-w-lg rounded-3xl border border-violet-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950" onClick={e => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-950/50">
              <FolderPlus className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-black">New Project</h2>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-bold">Project name</label>
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              placeholder="My Novel, Worldbuilding, etc."
              className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-base font-semibold outline-none focus:ring-2 focus:ring-violet-400 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">Folder</label>
            {folders.length > 0? (
              <select
                value={folderId}
                onChange={e => setFolderId(e.target.value)}
                className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-violet-400 dark:border-zinc-700 dark:bg-zinc-900"
              >
                {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            ) : (
              <div className="rounded-2xl border border-dashed border-violet-300 bg-violet-50/50 px-4 py-3 text-sm text-violet-700 dark:border-violet-900/50 dark:bg-violet-950/20 dark:text-violet-300">
                No folders yet — "My Projects" will be created automatically
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold">
              <Palette className="h-4 w-4" /> Color palette
            </label>

            <div className="grid grid-cols-1 gap-2 mb-3">
              {presetPalettes.map(p => (
                <button
                  key={p.name}
                  onClick={() => { setSelectedPreset(p); setUseCustom(false); }}
                  className={`flex items-center justify-between rounded-2xl border p-3 text-left transition ${!useCustom && selectedPreset.name === p.name? 'border-violet-500 ring-2 ring-violet-200 dark:ring-violet-900' : 'border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800'}`}
                >
                  <span className="text-sm font-semibold">{p.name}</span>
                  <div className="flex gap-1.5">
                    <div className="h-6 w-6 rounded-full border border-white/20" style={{background: p.primary}} />
                    <div className="h-6 w-6 rounded-full border border-white/20" style={{background: p.secondary}} />
                    <div className="h-6 w-6 rounded-full border border-white/20" style={{background: p.accent}} />
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setUseCustom(!useCustom)}
              className={`w-full rounded-2xl border p-3 text-left transition ${useCustom? 'border-violet-500 ring-2 ring-violet-200 dark:ring-violet-900' : 'border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800'}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Custom colors</span>
                <div className="flex gap-1.5">
                  <div className="h-6 w-6 rounded-full border" style={{background: custom.primary}} />
                  <div className="h-6 w-6 rounded-full border" style={{background: custom.secondary}} />
                  <div className="h-6 w-6 rounded-full border" style={{background: custom.accent}} />
                </div>
              </div>
            </button>

            {useCustom && (
              <div className="mt-3 grid grid-cols-3 gap-3">
                {['primary','secondary','accent'].map(key => (
                  <div key={key}>
                    <label className="mb-1 block text-xs capitalize text-zinc-500">{key}</label>
                    <input
                      type="color"
                      value={custom[key]}
                      onChange={e => setCustom({...custom, [key]: e.target.value})}
                      className="h-10 w-full cursor-pointer rounded-xl border border-zinc-200 dark:border-zinc-700"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3 flex items-center gap-2 rounded-xl bg-violet-50 p-3 dark:bg-zinc-900">
              <div className="h-8 w-8 rounded-lg" style={{background: palette.primary}} />
              <div className="h-8 w-8 rounded-lg" style={{background: palette.secondary}} />
              <div className="h-8 w-8 rounded-lg" style={{background: palette.accent}} />
              <span className="ml-2 text-xs text-zinc-600 dark:text-zinc-400">Preview</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-2xl border border-zinc-300 px-5 py-2.5 font-semibold hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">Cancel</button>
          <button onClick={handleCreate} disabled={!name.trim()} className="rounded-2xl bg-violet-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-violet-500/20 hover:bg-violet-700 disabled:opacity-50">Create Project</button>
        </div>
      </div>
    </div>
  );
}