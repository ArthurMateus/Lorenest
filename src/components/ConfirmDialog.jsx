import React from "react";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action can't be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  danger = true,
  onSecondary,
  secondaryText,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-3xl border border-violet-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-violet-50 to-fuchsia-50 px-6 pb-6 pt-8 dark:from-zinc-900 dark:to-zinc-900">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-xl p-1.5 text-zinc-400 hover:bg-white/60 hover:text-zinc-600 dark:hover:bg-zinc-800"
          >
            <X className="h-4 w-4" />
          </button>

          <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${
            danger
            ? 'bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400'
              : 'bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400'
          }`}>
            <AlertTriangle className="h-7 w-7" />
          </div>

          <h3 className="text-center text-xl font-black text-zinc-900 dark:text-white">
            {title}
          </h3>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-center text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 bg-zinc-50 px-6 py-4 dark:bg-zinc-900/50">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            {cancelText}
          </button>
          {secondaryText && (
            <button
              onClick={() => {
                onSecondary?.();
                onClose();
              }}
              className="flex-1 rounded-2xl border border-zinc-300 bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-200 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
            >
              {secondaryText}
            </button>
          )}
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition ${
              danger
              ? 'bg-red-600 shadow-red-500/25 hover:bg-red-700'
                : 'bg-violet-600 shadow-violet-500/25 hover:bg-violet-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}