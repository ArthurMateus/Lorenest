import React from "react";
import { X } from "lucide-react";

export default function TemplateApplyModal({ isOpen, onClose, template, boardName, onAdd, onReplace }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md" onClick={onClose}>
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-violet-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950" onClick={e => e.stopPropagation()}>
        <div className="relative bg-gradient-to-br from-violet-50 to-fuchsia-50 px-6 pb-6 pt-8 dark:from-zinc-900 dark:to-zinc-900">
          <button onClick={onClose} className="absolute right-4 top-4 rounded-xl p-1.5 text-zinc-400 hover:bg-white/60 hover:text-zinc-600 dark:hover:bg-zinc-800">
            <X className="h-4 w-4" />
          </button>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
            <span className="text-2xl">{template?.icon}</span>
          </div>
          <h3 className="text-center text-xl font-black text-zinc-900 dark:text-white">
            Add "{template?.name}"?
          </h3>
        </div>

        <div className="px-6 py-5">
          <p className="text-center text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Add {template?.cards?.length || 0} cards to "{boardName}"?
          </p>
        </div>

        <div className="flex flex-col gap-2 bg-zinc-50 px-6 py-4 dark:bg-zinc-900/50">
          <button onClick={onAdd} className="w-full rounded-2xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:bg-violet-700">
            Add Cards
          </button>
          <button onClick={onReplace} className="w-full rounded-2xl border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">
            Replace Board
          </button>
          <button onClick={onClose} className="w-full py-2 text-sm text-zinc-500 hover:text-zinc-700">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}