import React, { useState, useEffect, useRef } from "react";
import { Upload, X, Eye, Palette, AlignLeft, Tag, Link2, ChevronDown } from "lucide-react";
import { cardTypes, getCardType, getDefaultCardColor, getDefaultCardContent, isValidImageUrl } from "../utils/helpers";

function CardIcon({ type }) {
  const Icon = getCardType(type).icon;
  return <Icon size={16} />;
}

const COLOR_PRESETS = [
  "#f5f3ff","#ede9fe","#ddd6fe","#c4b5fd",
  "#fce7f3","#fbcfe8","#f9a8d4","#f472b6",
  "#dbeafe","#bfdbfe","#93c5fd","#60a5fa",
  "#d1fae5","#a7f3d0","#6ee7b7","#34d399",
  "#fef3c7","#fde68a","#fcd34d","#fbbf24",
  "#fee2e2","#fecaca","#fca5a5","#f87171",
  "#f3f4f6","#e5e7eb","#d1d5db","#9ca3af",
  "#1e1b4b","#312e81","#4c1d95","#5b21b6",
];

function contentLabel(type) {
  const labels = { image:"Image URL", spotify:"Spotify URL", pinterest:"Pinterest URL", link:"Link URL", code:"Code", table:"Table rows", kanban:"Kanban columns", timeline:"Timeline items", checklist:"Tasks", todo:"Tasks", title:"Title text", divider:"Divider label" };
  return labels[type] || "Content";
}

function contentHelp(type) {
  const helps = { checklist:"Use [ ] for open tasks and [x] for done tasks.", todo:"Use [ ] for open tasks and [x] for done tasks.", kanban:"Use ## Column Name, then bullet items underneath.", table:"Use rows separated by line breaks and columns separated by |.", timeline:"Use: date | title | notes.", divider:"A divider is intentionally minimal on the canvas.", title:"Titles render as section headers, not normal note cards." };
  return helps[type] || "";
}

export default function EditCardModal({ isOpen, onClose, card, onSave, selectedProject }) {
  const [draft, setDraft] = useState(null);
  const [activeTab, setActiveTab] = useState("content");
  const [typePickerOpen, setTypePickerOpen] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen && card) {
      setDraft({
        ...card,
        tags: Array.isArray(card.tags) ? card.tags.join(", ") : (card.tags || "")
      });
      setActiveTab("content");
      setTypePickerOpen(false);
    }
  }, [isOpen, card]);

  const handleSave = () => {
    if (!draft) return;
    const updated = {
      ...draft,
      tags: draft.tags ? draft.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      updatedAt: new Date().toISOString()
    };
    onSave?.(updated);
    onClose?.();
  };

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); handleSave(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose, draft]);

  if (!isOpen || !draft) return null;

  const currentType = getCardType(draft.type);
  const isShortInput = ["spotify","pinterest","link","image","divider","title"].includes(draft.type);

  const setType = (type) => setDraft((prev) => ({
    ...prev, type, title: getCardType(type).label,
    content: getDefaultCardContent(type), tags: "",
    color: getDefaultCardColor(type, selectedProject?.palette?.background || "#f5f3ff"),
  }));

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setDraft((prev) => ({ ...prev, content: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const update = (field, value) => setDraft((prev) => ({ ...prev, [field]: value }));
  const hasPreview = isValidImageUrl(draft.content) || draft.content?.startsWith("data:image");

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900" style={{ maxHeight: "90vh" }}>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: draft.color || "#f5f3ff" }}>
              <CardIcon type={draft.type} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Edit Card</h2>
              <p className="text-xs text-zinc-400">{currentType.label} block</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800"><X size={18} /></button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-zinc-100 px-6 pt-2 dark:border-zinc-800">
          {[{ id:"content", label:"Content", icon: AlignLeft },{ id:"style", label:"Style", icon: Palette }].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-1.5 rounded-t-xl px-4 py-2.5 text-sm font-semibold transition ${activeTab === tab.id ? "border-b-2 border-violet-500 text-violet-600 dark:text-violet-400" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"}`}>
              <tab.icon size={14} />{tab.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5" style={{ maxHeight: "60vh" }}>
          {activeTab === "content" && (
            <div className="space-y-5">
              {/* Card type */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Card Type</label>
                <button onClick={() => setTypePickerOpen(!typePickerOpen)} className="flex w-full items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold transition hover:border-violet-300 dark:border-zinc-700 dark:bg-zinc-800">
                  <span className="flex items-center gap-2"><CardIcon type={draft.type} />{currentType.label}</span>
                  <ChevronDown size={16} className={`transition ${typePickerOpen ? "rotate-180" : ""}`} />
                </button>
                {typePickerOpen && (
                  <div className="mt-2 grid max-h-48 grid-cols-3 gap-1.5 overflow-y-auto rounded-2xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
                    {cardTypes.map((ct) => (
                      <button key={ct.type} onClick={() => { setType(ct.type); setTypePickerOpen(false); }} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${draft.type === ct.type ? "bg-violet-600 text-white" : "hover:bg-white dark:hover:bg-zinc-700"}`}>
                        <CardIcon type={ct.type} />{ct.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Title</label>
                <input value={draft.title || ""} onChange={(e) => update("title", e.target.value)} className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:ring-violet-900/40" placeholder="Card title" />
              </div>

              {/* Tags */}
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"><Tag size={12} /> Tags</label>
                <input value={draft.tags || ""} onChange={(e) => update("tags", e.target.value)} className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:ring-violet-900/40" placeholder="idea, scene, reference" />
              </div>

              {/* Linked board */}
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"><Link2 size={12} /> Linked Board</label>
                <input value={draft.nextBoard || ""} onChange={(e) => update("nextBoard", e.target.value)} className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:ring-violet-900/40" placeholder="Optional board name" />
              </div>

              {/* Content */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{contentLabel(draft.type)}</label>
                {contentHelp(draft.type) && <p className="mb-2 text-xs text-zinc-400 italic">{contentHelp(draft.type)}</p>}
                {draft.type === "image" && (
                  <label className="mb-3 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50 py-6 text-sm font-semibold text-zinc-500 transition hover:border-violet-400 hover:bg-violet-50 hover:text-violet-600 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:border-violet-500 dark:hover:bg-zinc-700">
                    <Upload size={18} />Drop or click to upload image
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
                {isShortInput ? (
                  <input value={draft.content || ""} onChange={(e) => update("content", e.target.value)} className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:ring-violet-900/40" placeholder="Paste content or URL..." />
                ) : (
                  <textarea ref={contentRef} value={draft.content || ""} onChange={(e) => update("content", e.target.value)} rows={6} className="w-full resize-y rounded-2xl border border-zinc-200 bg-white px-4 py-3 font-mono text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:ring-violet-900/40" placeholder="Write the card content..." />
                )}
                {hasPreview && (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700">
                    <div className="flex items-center gap-1.5 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-400 dark:bg-zinc-800"><Eye size={12} /> Preview</div>
                    <img src={draft.content} alt="preview" className="max-h-48 w-full object-contain bg-zinc-100 dark:bg-zinc-900" />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "style" && (
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Card Color</label>
                <div className="mb-3 flex items-center gap-3">
                  <input type="color" value={draft.color || "#f5f3ff"} onChange={(e) => update("color", e.target.value)} className="h-11 w-14 cursor-pointer rounded-xl border border-zinc-200 dark:border-zinc-700" />
                  <input type="text" value={draft.color || "#f5f3ff"} onChange={(e) => update("color", e.target.value)} className="w-28 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-800" placeholder="#hex" />
                </div>
                <div className="grid grid-cols-8 gap-1.5">
                  {COLOR_PRESETS.map((c) => (
                    <button key={c} onClick={() => update("color", c)} className="h-8 w-full rounded-lg border-2 transition hover:scale-110" style={{ background: c, borderColor: draft.color === c ? "#7c3aed" : "transparent" }} />
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Preview</label>
                <div className="flex min-h-[100px] items-center justify-center rounded-2xl border border-zinc-200 p-6 dark:border-zinc-700" style={{ background: draft.color || "#f5f3ff" }}>
                  <div className="text-center">
                    <CardIcon type={draft.type} />
                    <p className="mt-2 text-sm font-bold text-zinc-700 dark:text-zinc-200">{draft.title || "Untitled"}</p>
                    {draft.tags && (
                      <div className="mt-2 flex flex-wrap justify-center gap-1">
                        {draft.tags.split(",").map((tag, i) => tag.trim() && (
                          <span key={i} className="rounded-full bg-white/60 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 dark:bg-black/20 dark:text-zinc-300">{tag.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <p className="text-[11px] text-zinc-400"><kbd className="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-zinc-700 dark:bg-zinc-800">⌘ Enter</kbd> to save</p>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-2xl px-5 py-2.5 text-sm font-semibold text-zinc-500 transition hover:bg-zinc-100 dark:hover:bg-zinc-800">Cancel</button>
            <button onClick={handleSave} className="rounded-2xl bg-violet-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 dark:shadow-violet-900/30">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
