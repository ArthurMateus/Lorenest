import React from "react";
import { Palette, Plus } from "lucide-react";

export default function PalettePanel({ selectedProject, changePalette, cardTypes, openCreateCardModal }) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col gap-4 overflow-hidden border-r border-violet-100 bg-white/65 p-3 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/65">
      <div className="rounded-3xl border border-violet-100 bg-white/80 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="mb-3 flex items-center gap-2 text-sm font-black"><Palette className="h-4 w-4" /> Project palette</div>
        <div className="space-y-2">
          {Object.entries(selectedProject.palette).map(([key, value]) => (
            <label key={key} className="block text-xs font-semibold capitalize text-zinc-500">
              {key}
              <div className="mt-1 flex items-center gap-2">
                <input type="color" value={value} onChange={(event) => changePalette(key, event.target.value)} className="h-9 w-11 rounded-2xl border bg-transparent" />
                <input value={value} onChange={(event) => changePalette(key, event.target.value)} className="min-w-0 flex-1 rounded-xl border border-violet-200 bg-white px-2 py-2 text-xs dark:border-zinc-700 dark:bg-zinc-950" />
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col rounded-3xl border border-violet-100 bg-white/80 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="flex items-center gap-2 border-b border-violet-100 px-4 py-3 text-sm font-black dark:border-zinc-800"><Plus className="h-4 w-4" /> Add card</div>
        <div className="min-h-0 flex-1 overflow-y-auto p-3 pr-2">
          <div className="grid grid-cols-1 gap-2">
            {cardTypes.map((item) => {
              const Icon = item.icon;
              return <button key={item.type} onClick={() => openCreateCardModal(item.type)} className="flex items-center gap-2 rounded-2xl border border-violet-100 bg-white/70 p-3 text-left text-xs font-black transition hover:border-violet-300 hover:bg-violet-50 dark:border-zinc-800 dark:bg-zinc-950/50 dark:hover:bg-zinc-800"><Icon className="h-4 w-4 shrink-0" /><span className="truncate">{item.label}</span></button>;
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
