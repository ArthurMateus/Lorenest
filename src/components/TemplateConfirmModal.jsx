import React from "react";
import { Sparkles, Plus, Replace } from "lucide-react";

export default function TemplateConfirmModal({ isOpen, onClose, template, onAdd, onReplace }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border-violet-200 bg-white p-8 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl text-3xl" style={{background: `${template?.color}20`}}>
            {template?.icon}
          </div>
          <h2 className="text-2xl font-black">Apply {template?.name}?</h2>
          <p className="mt-2 text-zinc-500">This template will create {template?.boards?.length || 0} new boards with pre-made cards.</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onAdd}
            className="flex w-full items-center gap-3 rounded-2xl border-2 border-violet-200 bg-violet-50 p-4 text-left transition hover:bg-violet-100 dark:border-violet-900 dark:bg-violet-950/30"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white"><Plus className="h-5 w-5"/></div>
            <div>
              <div className="font-bold">Add to project</div>
              <div className="text-sm text-zinc-500">Keep current boards, add new ones</div>
            </div>
          </button>

          <button
            onClick={onReplace}
            className="flex w-full items-center gap-3 rounded-2xl border-2 border-zinc-200 p-4 text-left transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900"><Replace className="h-5 w-5"/></div>
            <div>
              <div className="font-bold">Replace project</div>
              <div className="text-sm text-zinc-500">Delete current boards, use template only</div>
            </div>
          </button>
        </div>

        <button onClick={onClose} className="mt-4 w-full rounded-2xl py-3 text-sm font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900">Cancel</button>
      </div>
    </div>
  );
}