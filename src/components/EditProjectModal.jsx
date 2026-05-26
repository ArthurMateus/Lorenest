import React, { useState, useEffect } from "react";
import { X, Palette, Edit3 } from "lucide-react";

const presets = [
  { name: "Violet Dream", primary: "#7c3aed", secondary: "#a855f7", accent: "#ec4899" },
  { name: "Ocean", primary: "#0ea5e9", secondary: "#06b6d4", accent: "#3b82f6" },
  { name: "Forest", primary: "#059669", secondary: "#10b981", accent: "#84cc16" },
  { name: "Sunset", primary: "#ea580c", secondary: "#f97316", accent: "#eab308" },
  { name: "Rose", primary: "#e11d48", secondary: "#f43f5e", accent: "#fb7185" },
];

export default function EditProjectModal({ isOpen, onClose, project, onSave, onDelete }) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Planning");
  const [palette, setPalette] = useState(presets[0]);
  const [custom, setCustom] = useState({ primary: "#7c3aed", secondary: "#a855f7", accent: "#ec4899" });
  const [useCustom, setUseCustom] = useState(false);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setStatus(project.status);
      const p = project.palette;
      setCustom({ primary: p.primary, secondary: p.secondary, accent: p.accent });
      setPalette({ primary: p.primary, secondary: p.secondary, accent: p.accent });
      setUseCustom(true);
    }
  }, [project, isOpen]);

  if (!isOpen || !project) return null;

  const handleSave = () => {
    const finalPalette = useCustom ? custom : palette;
    onSave({
      ...project,
      name: name.trim(),
      status,
      palette: { ...project.palette, primary: finalPalette.primary, secondary: finalPalette.secondary, accent: finalPalette.accent }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur" onClick={onClose}>
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-950" onClick={e => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-950/50"><Edit3 className="h-5 w-5" /></div>
            <h2 className="text-xl font-black">Edit Project</h2>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-bold">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full rounded-2xl border border-zinc-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-400 dark:border-zinc-700 dark:bg-zinc-900" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className="w-full rounded-2xl border border-zinc-200 px-4 py-2.5 dark:border-zinc-700 dark:bg-zinc-900">
              {["Planning","Drafting","Editing","Complete","Archived"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold"><Palette className="h-4 w-4" /> Palette</label>
            <div className="grid grid-cols-5 gap-2 mb-3">
              {presets.map(p => (
                <button key={p.name} onClick={() => { setPalette(p); setUseCustom(false); }} className={`h-10 rounded-xl border-2 ${!useCustom && palette.primary===p.primary ? 'border-violet-500' : 'border-transparent'}`} style={{background: `linear-gradient(135deg, ${p.primary}, ${p.accent})`}} title={p.name} />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setUseCustom(true)} className={`rounded-xl border px-3 py-2 text-sm ${useCustom?'border-violet-500 bg-violet-50 dark:bg-violet-950/30':'border-zinc-200 dark:border-zinc-700'}`}>Custom</button>
              {useCustom && (
                <div className="flex gap-2">
                  {['primary','secondary','accent'].map(k => (
                    <input key={k} type="color" value={custom[k]} onChange={e => setCustom({...custom, [k]: e.target.value})} className="h-9 w-12 cursor-pointer rounded-lg border" title={k} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button onClick={() => { onDelete(project.id); onClose(); }} className="rounded-2xl px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40">Delete project</button>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-2xl border px-5 py-2.5 font-semibold dark:border-zinc-700">Cancel</button>
            <button onClick={handleSave} className="rounded-2xl bg-violet-600 px-5 py-2.5 font-semibold text-white hover:bg-violet-700">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
