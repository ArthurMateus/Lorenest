import React, { useState } from "react";
import { X, Trash2, Edit3, Sparkles } from "lucide-react";

const CATEGORIES = ["All", "Writing", "Characters", "Worldbuilding", "Planning", "Moodboard", "Research"];

export default function TemplateLibraryModal({ isOpen, onClose, templates, onApply, onSaveCurrent, onDelete, onRename }) {
  const [activeCategory, setActiveCategory] = useState("All");

  if (!isOpen) return null;

  const handleRename = (t) => {
    const name = window.prompt("Rename template:", t.name);
    if (name && name.trim() && name !== t.name) onRename(t.id, name.trim());
  };

  const builtIn = templates.filter((t) => !t.custom);
  const custom = templates.filter((t) => t.custom);

  const filterByCategory = (list) => {
    if (activeCategory === "All") return list;
    return list.filter((t) => t.category === activeCategory);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden"
        style={{ background: '#FFFDF8', borderColor: 'rgba(38,49,66,0.12)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: 'rgba(38,49,66,0.08)' }}>
          <div>
            <h3 className="text-lg font-bold" style={{ color: '#243B67' }}>✦ Template Library</h3>
            <p className="text-xs" style={{ color: '#7A7F8A' }}>Choose a template to populate your board</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onSaveCurrent} className="rounded-xl border px-3 py-1.5 text-xs font-bold transition hover:bg-[#f0eef9]" style={{ borderColor: 'rgba(38,49,66,0.12)', color: '#243B67' }}>
              <Sparkles className="inline h-3.5 w-3.5 mr-1" /> Save Current Board
            </button>
            <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-[#f0eef9]" style={{ color: '#7A7F8A' }}>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-1 overflow-x-auto px-6 pt-3 pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition"
              style={{
                background: activeCategory === cat ? '#243B67' : 'transparent',
                color: activeCategory === cat ? '#fff' : '#7A7F8A',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
          {/* Custom Templates */}
          {filterByCategory(custom).length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#7A7F8A' }}>My Templates</h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {filterByCategory(custom).map((t) => (
                  <TemplateCard key={t.id} t={t} onApply={onApply} onClose={onClose} onRename={handleRename} onDelete={onDelete} isCustom />
                ))}
              </div>
            </div>
          )}

          {/* Built-in Templates */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#7A7F8A' }}>Built-in Templates</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              {filterByCategory(builtIn).map((t) => (
                <TemplateCard key={t.id} t={t} onApply={onApply} onClose={onClose} onRename={handleRename} onDelete={onDelete} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TemplateCard({ t, onApply, onClose, onRename, onDelete, isCustom }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border p-3 transition hover:shadow-md" style={{ background: '#FFFDF8', borderColor: 'rgba(38,49,66,0.08)' }}>
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-lg" style={{ background: '#f0eef9' }}>
        {t.icon || '📋'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm" style={{ color: '#1E293B' }}>{t.name}</div>
        {t.description && <p className="text-[11px] mt-0.5 line-clamp-2" style={{ color: '#7A7F8A' }}>{t.description}</p>}
        <div className="text-[10px] font-bold mt-1" style={{ color: '#8B7CF6' }}>
          {t.cards?.length || t.cardCount || 0} cards
          {t.category && <span className="ml-2" style={{ color: '#A0A4AD' }}>• {t.category}</span>}
        </div>
        <div className="flex gap-1.5 mt-2">
          <button
            onClick={() => { onApply(t); onClose(); }}
            className="rounded-lg px-3 py-1 text-[11px] font-bold text-white transition hover:opacity-90"
            style={{ background: '#243B67' }}
          >
            Use Template
          </button>
          <button onClick={() => onRename(t)} className="rounded-lg border p-1 hover:bg-[#f0eef9]" style={{ borderColor: 'rgba(38,49,66,0.12)' }} title="Rename">
            <Edit3 className="h-3 w-3" style={{ color: '#7A7F8A' }} />
          </button>
          {isCustom && (
            <button onClick={() => onDelete(t.id)} className="rounded-lg border border-red-200 p-1 text-red-600 hover:bg-red-50" title="Delete">
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}