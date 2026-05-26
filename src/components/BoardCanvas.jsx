import React, { useEffect, useMemo, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Copy,
  Edit3,
  Eye,
  EyeOff,
  FolderOpen,
  Grid3X3,
  Link2,
  Lock,
  Magnet,
  MapPin,
  Maximize2,
  PanelRightOpen,
  Quote as QuoteIcon,
  RotateCcw,
  Tags,
  Trash2,
  Unlock,
  X,
  ZoomIn,
  ZoomOut,
  CheckSquare,
  Square,
  Plus,
  FileText,
  ListTodo,
} from "lucide-react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import {
  cn,
  getPinterestPinId,
  getSpotifyEmbedUrl,
  isValidImageUrl,
} from "../utils/helpers";

const CANVAS_SIZE = 50000;
const GRID_SIZE = 24;
const MIN_W = 180;
const MIN_H = 130;

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const snap = (v, enabled) =>
  enabled ? Math.round(v / GRID_SIZE) * GRID_SIZE : v;

/* ── Canvas Button ── */
function CanvasButton({ children, title, active, onClick }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
      }}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border px-2.5 text-xs font-bold transition",
        active
          ? "border-violet-500/30 bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300"
          : "border-[rgba(38,49,66,0.12)] bg-[#FFFDF8]/90 text-[#1E293B] shadow-sm hover:bg-[#FFFDF8] dark:bg-zinc-900/90 dark:text-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-800"
      )}
    >
      {children}
    </button>
  );
}

/* ── Card Action Button ── */
function CardActionButton({ children, title, onClick, danger }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
      }}
      className={cn(
        "inline-flex h-6 w-6 items-center justify-center rounded-lg transition",
        danger
          ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50"
          : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
      )}
    >
      {children}
    </button>
  );
}

function CardIcon({ type, getCardType }) {
  const Icon = getCardType?.(type)?.icon;
  return Icon ? <Icon className="h-4 w-4 shrink-0" /> : null;
}

/* ── usePrefs hook ── */
function usePrefs() {
  const defaults = {
    showGrid: true,
    gridType: "dots",
    snapToGrid: false,
    showMinimap: true,
    focusMode: false,
  };

  const [prefs, setPrefs] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("lorenest.canvas.preferences")
      );
      return saved ? { ...defaults, ...saved } : defaults;
    } catch {
      return defaults;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "lorenest.canvas.preferences",
        JSON.stringify(prefs)
      );
    } catch {}
  }, [prefs]);

  const togglePref = (key) => {
    setPrefs((prev) => {
      const copy = { ...prev };
      copy[key] = !prev[key];
      return copy;
    });
  };

  const setPref = (key, val) => {
    setPrefs((prev) => {
      const copy = { ...prev };
      copy[key] = val;
      return copy;
    });
  };

  return [prefs, togglePref, setPref];
}

/* ── getBounds ── */
function getBounds(cards = []) {
  if (!cards.length) {
    return { minX: 0, minY: 0, maxX: 2000, maxY: 1600, width: 2000, height: 1600 };
  }
  const pad = 280;
  const minX = Math.min(...cards.map((c) => c.x || 0), 0) - pad;
  const minY = Math.min(...cards.map((c) => c.y || 0), 0) - pad;
  const maxX = Math.max(...cards.map((c) => (c.x || 0) + (c.w || 320)), 1200) + pad;
  const maxY = Math.max(...cards.map((c) => (c.y || 0) + (c.h || 220)), 900) + pad;
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

/* ── Parsers ── */
function parseChecklist(content = "") {
  return content.split("\n").filter(Boolean).map((line, i) => ({
    id: i,
    done: /^\s*\[[xX]\]/.test(line),
    text: line.replace(/^\s*\[[ xX]\]\s*/, ""),
  }));
}

function parseTable(content = "") {
  return content.split("\n").filter(Boolean).map((row) => row.split("|").map((c) => c.trim()));
}

function parseKanban(content = "") {
  const cols = [];
  let cur = null;
  content.split("\n").forEach((line) => {
    if (line.startsWith("## ")) {
      cur = { title: line.replace(/^##\s*/, ""), items: [] };
      cols.push(cur);
    } else if (cur && line.trim()) {
      cur.items.push(line.replace(/^[-*]\s*/, ""));
    }
  });
  return cols.length ? cols : [{ title: "Items", items: content.split("\n").filter(Boolean) }];
}

function parseTimeline(content = "") {
  return content.split("\n").filter(Boolean).map((line, i) => {
    const [date, title, notes] = line.split("|").map((p) => p?.trim());
    return { id: i, date: date || "Date", title: title || line, notes: notes || "" };
  });
}

/* ── ConnectionLines ── */
function ConnectionLines({ cards }) {
  const cardMap = useMemo(() => {
    const m = {};
    cards.forEach((c) => { m[c.id] = c; });
    return m;
  }, [cards]);

  const lines = useMemo(() => {
    const result = [];
    cards.forEach((card) => {
      if (!Array.isArray(card.connections)) return;
      card.connections.forEach((conn) => {
        const target = cardMap[conn.targetId];
        if (!target) return;
        result.push({
          id: card.id + "-" + conn.targetId,
          x1: (card.x || 0) + (card.w || 320) / 2,
          y1: (card.y || 0) + (card.h || 220) / 2,
          x2: (target.x || 0) + (target.w || 320) / 2,
          y2: (target.y || 0) + (target.h || 220) / 2,
          label: conn.label,
        });
      });
    });
    return result;
  }, [cards, cardMap]);

  if (!lines.length) return null;

  return (
    <svg style={{ position: "absolute", inset: 0, width: CANVAS_SIZE + "px", height: CANVAS_SIZE + "px", pointerEvents: "none", zIndex: 0 }}>
      <defs>
        <marker id="ln-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6" fill="none" stroke="#8B7CF6" strokeWidth="1.5" />
        </marker>
      </defs>
      {lines.map((l) => (
        <g key={l.id}>
          <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#8B7CF6" strokeWidth="2" strokeOpacity="0.5" strokeDasharray="6 4" markerEnd="url(#ln-arrow)" />
          {l.label && (
            <text x={(l.x1 + l.x2) / 2} y={(l.y1 + l.y2) / 2 - 8} textAnchor="middle" fill="#243B67" fontSize="12" fontWeight="600" style={{ fontFamily: "Inter, sans-serif" }}>
              {l.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

/* ── Minimap ── */
function Minimap({ cards, selectedCardId, state, setTransform, size }) {
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const bounds = useMemo(() => getBounds(cards), [cards]);
  const mapW = 230;
  const mapH = 150;
  const scale = state?.scale || 1;
  const viewX = -(state?.positionX || 0) / scale;
  const viewY = -(state?.positionY || 0) / scale;
  const viewW = size.w / scale;
  const viewH = size.h / scale;

  const jump = (e) => {
    e.stopPropagation();
    const r = e.currentTarget.getBoundingClientRect();
    const sx = mapW / bounds.width;
    const sy = mapH / bounds.height;
    const cx = (e.clientX - r.left) / sx + bounds.minX;
    const cy = (e.clientY - r.top) / sy + bounds.minY;
    setTransform(-cx * scale + size.w / 2, -cy * scale + size.h / 2, scale, 280, "easeOut");
  };

  return (
    <div className="absolute bottom-4 right-4 z-[1000] select-none" style={{"--minimap-bg": isDark ? "rgba(24,24,27,0.9)" : "#FFFDf8ee"}}>
      <div className="overflow-hidden rounded-2xl border shadow-lg backdrop-blur-xl" style={{ borderColor: "rgba(38,49,66,0.12)", background: "var(--minimap-bg, #FFFDf8ee)" }}>
        <div className="flex items-center justify-between border-b px-3 py-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: isDark ? "#e4e4e7" : "#243B67", borderColor: "rgba(38,49,66,0.08)" }}>
          <span>Minimap</span>
          <span className="rounded-full px-2 py-0.5 text-[10px]" style={{ background: isDark ? "rgba(124,58,237,0.2)" : "#f0eef9", color: isDark ? "#a78bfa" : "#8B7CF6" }}>{cards.length}</span>
        </div>
        <div onClick={jump} onMouseDown={(e) => e.stopPropagation()} className="cursor-crosshair" style={{ width: mapW, height: mapH }}>
          <svg width={mapW} height={mapH} viewBox={bounds.minX + " " + bounds.minY + " " + bounds.width + " " + bounds.height}>
            <rect x={bounds.minX} y={bounds.minY} width={bounds.width} height={bounds.height} fill={isDark ? "#27272a" : "#F4F1EA"} />
            {cards.map((c) => (
              <rect key={c.id} x={c.x || 0} y={c.y || 0} width={c.w || 320} height={c.h || 220} fill={c.color || "#f0eef9"} stroke={c.id === selectedCardId ? "#8B7CF6" : "#243B67"} strokeOpacity={c.id === selectedCardId ? 1 : 0.2} strokeWidth={c.id === selectedCardId ? 14 : 6} rx="10" />
            ))}
            <rect x={viewX} y={viewY} width={viewW} height={viewH} fill="none" stroke="#243B67" strokeWidth="12" strokeDasharray="30 15" rx="8" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ── PinterestEmbed ── */
function PinterestEmbed({ url }) {
  const clean = (url || "").trim().replace(/https?:\/\/(br|pt|es|fr|de|it)\.pinterest\.com/, "https://www.pinterest.com");
  const pinId = getPinterestPinId(clean);
  const stop = (e) => e.stopPropagation();

  useEffect(() => {
    const loadPin = () => {
      if (window.PinUtils) { try { window.PinUtils.build(); } catch {} return; }
      if (document.querySelector('script[src*="pinit.js"]')) return;
      const s = document.createElement("script");
      s.async = true;
      s.src = "https://assets.pinterest.com/js/pinit.js";
      s.onload = () => { try { window.PinUtils?.build(); } catch {} };
      (document.head || document.body).appendChild(s);
    };
    const t = setTimeout(loadPin, 100);
    return () => clearTimeout(t);
  }, [clean]);

  if (!clean) return null;

  if (pinId) {
    return (
      <div className="h-full w-full overflow-hidden rounded-2xl bg-white" onWheel={stop} onPointerDown={stop} onMouseDown={stop}>
        {"https://assets.pinterest.com/ext/embed.html?id=" + pinId}
      </div>
    );
  }

  if (clean.includes("pinterest.com/")) {
    return (
      <div className="h-full w-full overflow-auto rounded-2xl bg-white" onWheel={stop} onPointerDown={stop} onMouseDown={stop} style={{ padding: "8px" }}>
        <a data-pin-do="embedBoard" data-pin-board-width="900" data-pin-scale-height="320" data-pin-scale-width="120" href={clean} />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl border p-4 text-center text-sm" style={{ borderColor: "rgba(38,49,66,0.08)", background: "#FFFDF8", color: "#7A7F8A" }} onWheel={stop} onPointerDown={stop} onMouseDown={stop}>
      <div className="font-bold" style={{ color: "#1E293B" }}>Pinterest link saved</div>
      <div className="max-w-full truncate text-xs">{clean}</div>
      <a href={clean} target="_blank" rel="noreferrer" className="rounded-xl px-3 py-2 text-xs font-bold text-white" style={{ background: "#243B67" }} onClick={stop}>Open Pinterest</a>
    </div>
  );
}

/* ── SelectedBar ── */
function SelectedBar({ selectedCard, onEdit, onDuplicate, onLock, onDelete, onFocus }) {
  if (!selectedCard) return null;
  return (
    <div className="absolute bottom-5 left-1/2 z-[1000] flex -translate-x-1/2 items-center gap-2 rounded-2xl border p-2 shadow-lg backdrop-blur-xl" style={{ borderColor: "rgba(38,49,66,0.12)", background: "var(--minimap-bg, #FFFDf8ee)" }}>
      <div className="hidden max-w-[220px] truncate px-2 text-xs font-bold sm:block" style={{ color: "#1E293B" }}>{selectedCard.title || "Untitled"}</div>
      <CanvasButton title="Edit selected" onClick={onEdit}><Edit3 className="h-3.5 w-3.5" /> Edit</CanvasButton>
      <CanvasButton title="Focus selected" onClick={onFocus}><Maximize2 className="h-3.5 w-3.5" /></CanvasButton>
      <CanvasButton title="Duplicate selected" onClick={onDuplicate}><Copy className="h-3.5 w-3.5" /></CanvasButton>
      <CanvasButton title="Lock selected" onClick={onLock}>{selectedCard.locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}</CanvasButton>
      <button type="button" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete?.(); }} className="inline-flex h-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-2.5 text-xs font-bold text-red-600 hover:bg-red-100"><Trash2 className="h-3.5 w-3.5" /></button>
    </div>
  );
}

/* ── KanbanBoardView ── */
function KanbanBoardView({ cards, updateCard, openEditCardModal, deleteCard, duplicateCard }) {
  const cols = [
    { key: "backlog", title: "Backlog", color: "#eef2f9" },
    { key: "doing", title: "Doing", color: "#fdf8ee" },
    { key: "done", title: "Done", color: "#eef6ee" },
  ];

  const getStatus = (card) => (card.tags || []).find((tag) => cols.some((c) => c.key === tag)) || "backlog";
  const move = (card, status) => updateCard(card.id, { tags: Array.from(new Set([...(card.tags || []).filter((tag) => !cols.some((c) => c.key === tag)), status])) });

  return (
    <div className="h-full overflow-auto p-6">
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        {cols.map((col) => (
          <div key={col.key} className="rounded-2xl border p-4 shadow-md" style={{ borderColor: "rgba(38,49,66,0.08)", background: "#FFFDF8" }}>
            <div className="text-xs font-bold uppercase tracking-wide" style={{ color: "#243B67" }}>{col.title}</div>
            <div className="mt-1 text-3xl font-black" style={{ color: "#1E293B" }}>{cards.filter((c) => getStatus(c) === col.key).length}</div>
          </div>
        ))}
      </div>
      <div className="grid min-w-[920px] grid-cols-3 gap-4">
        {cols.map((col) => {
          const list = cards.filter((c) => getStatus(c) === col.key);
          return (
            <div key={col.key} className="rounded-2xl border p-3 shadow-md" style={{ background: col.color, borderColor: "rgba(38,49,66,0.06)" }}>
              <div className="mb-3 flex items-center justify-between px-1">
                <h3 className="font-bold" style={{ color: "#1E293B" }}>{col.title}</h3>
                <span className="rounded-full px-2 py-1 text-xs font-bold" style={{ background: "#FFFDF8", color: "#7A7F8A" }}>{list.length}</span>
              </div>
              <div className="space-y-2">
                {list.map((card) => (
                  <div key={card.id} className="rounded-xl border p-3 shadow-sm" style={{ background: "#FFFDF8", borderColor: "rgba(38,49,66,0.08)" }}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold" style={{ color: "#1E293B" }}>{card.title}</div>
                        <p className="mt-1 line-clamp-3 text-xs" style={{ color: "#7A7F8A" }}>{card.content}</p>
                      </div>
                      <button onClick={() => openEditCardModal(card)} className="rounded-lg p-1 hover:bg-[#f0eef9]" style={{ color: "#7A7F8A" }}><Edit3 className="h-3.5 w-3.5" /></button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {cols.map((t) => (
                        <button key={t.key} onClick={() => move(card, t.key)} className={cn("rounded-full px-2 py-1 text-[10px] font-bold", t.key === col.key ? "text-white" : "text-[#7A7F8A] hover:bg-[#f0eef9]")} style={t.key === col.key ? { background: "#243B67" } : { background: "#F4F1EA" }}>{t.title}</button>
                      ))}
                      <button onClick={() => duplicateCard(card.id)} className="rounded-full px-2 py-1 text-[10px] font-bold" style={{ background: "#F4F1EA", color: "#7A7F8A" }}>Copy</button>
                      <button onClick={() => deleteCard(card.id)} className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-bold text-red-600 hover:bg-red-100">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── CardBody ── */

function CardBody({ card, updateCard, goToBoard, openSubBoardForCard }) {
  const spotify = getSpotifyEmbedUrl(card.content);
  const tags = card.tags || [];
  const stop = (e) => e.stopPropagation();
  const [newTask, setNewTask] = useState("");

  const typeStyles = {
    note: { bg: "#FFFBF5", accent: "#F59E0B", icon: FileText, label: "Note" },
    text: { bg: "#FFFBF5", accent: "#F59E0B", icon: FileText, label: "Note" },
    checklist: { bg: "#F0FDF4", accent: "#10B981", icon: ListTodo, label: "Checklist" },
    todo: { bg: "#F0FDF4", accent: "#10B981", icon: ListTodo, label: "To-Do" },
    character: { bg: "#FDF2F8", accent: "#EC4899", icon: null, label: "Character" },
    scene: { bg: "#EFF6FF", accent: "#3B82F6", icon: BookOpen, label: "Scene" },
    location: { bg: "#FEFCE8", accent: "#EAB308", icon: MapPin, label: "Location" },
    quote: { bg: "#F5F3FF", accent: "#8B5CF6", icon: QuoteIcon, label: "Quote" },
    link: { bg: "#F0F9FF", accent: "#0EA5E9", icon: Link2, label: "Link" },
    image: { bg: "#FAFAF9", accent: "#78716C", icon: null, label: "Image" },
    folder: { bg: "#EEF2FF", accent: "#6366F1", icon: FolderOpen, label: "Folder" },
    kanban: { bg: "#FAF5FF", accent: "#A855F7", icon: null, label: "Kanban" },
    table: { bg: "#FFFFFF", accent: "#64748B", icon: null, label: "Table" },
    timeline: { bg: "#FFF7ED", accent: "#EA580C", icon: null, label: "Timeline" },
    code: { bg: "#0F172A", accent: "#38BDF8", icon: null, label: "Code" },
    spotify: { bg: "#F0FDF4", accent: "#1DB954", icon: null, label: "Spotify" },
    pinterest: { bg: "#FEF2F2", accent: "#E60023", icon: null, label: "Pinterest" },
  };

  const style = typeStyles[card.type] || typeStyles.note;

  const renderContent = () => {
    if (card.type === "folder") {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-5 text-center" style={{ background: `linear-gradient(135deg, ${style.bg}, white)` }}>
          <div className="grid h-14 w-14 place-items-center rounded-2xl shadow-inner" style={{ background: card.color || style.accent }}>
            <FolderOpen className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="text-base font-black" style={{ color: "#1E293B" }}>{card.title || "Untitled Folder"}</div>
            {card.content && <div className="mt-1 text-xs" style={{ color: "#64748B" }}>{card.content}</div>}
          </div>
          <button type="button" onMouseDown={stop} onClick={(e) => { e.stopPropagation(); openSubBoardForCard?.(card); }} className="mt-1 inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-lg transition hover:opacity-90 active:scale-95" style={{ background: card.color || style.accent }}>
            Open Board <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      );
    }

    if (card.type === "quote") {
      return (
        <div className="h-full overflow-auto p-5" style={{ background: style.bg }}>
          <div className="flex items-start gap-3">
            <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full" style={{ background: style.accent }}>
              <QuoteIcon className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: style.accent }}>Quote</div>
              <div className="mt-1 text-[15px] italic leading-relaxed" style={{ fontFamily: "Georgia, serif", color: "#1E293B" }}>{card.content || "Enter your quote..."}</div>
            </div>
          </div>
        </div>
      );
    }

    if (card.type === "character") {
      return (
        <div className="h-full overflow-auto p-4" style={{ background: style.bg }}>
          <div className="mb-3 flex items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-lg font-black text-white shadow-md" style={{ background: `linear-gradient(135deg, ${card.color || style.accent}, ${style.accent})` }}>{(card.title || "C")[0].toUpperCase()}</div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: style.accent }}>Character</div>
              <div className="text-base font-black leading-tight" style={{ color: "#1E293B" }}>{card.title || "Unnamed"}</div>
            </div>
          </div>
          <textarea value={card.content || ""} disabled={card.locked} onChange={(e) => updateCard(card.id, { content: e.target.value })} onMouseDown={stop} className="h-[calc(100%-64px)] w-full resize-none rounded-xl border-2 bg-white/70 p-3 text-sm outline-none transition focus:bg-white disabled:opacity-70" style={{ borderColor: `${style.accent}30`, color: "#1E293B" }} placeholder="Personality, backstory, motivations..." />
        </div>
      );
    }

    if (card.type === "scene") {
      return (
        <div className="h-full overflow-auto p-4" style={{ background: style.bg }}>
          <div className="mb-2 flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: style.accent }}><BookOpen className="h-4 w-4 text-white" /></div>
            <span className="text-[11px] font-black uppercase tracking-wider" style={{ color: style.accent }}>Scene</span>
          </div>
          <textarea value={card.content || ""} disabled={card.locked} onChange={(e) => updateCard(card.id, { content: e.target.value })} onMouseDown={stop} className="h-[calc(100%-36px)] w-full resize-none rounded-xl border-2 bg-white/70 p-3 text-sm outline-none transition focus:bg-white disabled:opacity-70" style={{ borderColor: `${style.accent}30` }} placeholder="What happens in this scene?" />
        </div>
      );
    }

    if (card.type === "location") {
      return (
        <div className="h-full overflow-auto p-4" style={{ background: style.bg }}>
          <div className="mb-2 flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: style.accent }}><MapPin className="h-4 w-4 text-white" /></div>
            <span className="text-[11px] font-black uppercase tracking-wider" style={{ color: style.accent }}>Location</span>
          </div>
          <textarea value={card.content || ""} disabled={card.locked} onChange={(e) => updateCard(card.id, { content: e.target.value })} onMouseDown={stop} className="h-[calc(100%-36px)] w-full resize-none rounded-xl border-2 bg-white/70 p-3 text-sm outline-none transition focus:bg-white disabled:opacity-70" style={{ borderColor: `${style.accent}30` }} placeholder="Describe sights, sounds, atmosphere..." />
        </div>
      );
    }

    if (card.type === "link") {
      const isUrl = card.content?.startsWith('http');
      return (
        <div className="h-full overflow-auto p-4" style={{ background: style.bg }}>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: style.accent }}><Link2 className="h-4 w-4 text-white" /></div>
              <span className="text-[11px] font-black uppercase tracking-wider" style={{ color: style.accent }}>Bookmark</span>
            </div>
            {isUrl && <a href={card.content} target="_blank" rel="noreferrer" onMouseDown={stop} className="text-[11px] font-bold hover:underline" style={{ color: style.accent }}>Open →</a>}
          </div>
          <textarea value={card.content || ""} disabled={card.locked} onChange={(e) => updateCard(card.id, { content: e.target.value })} onMouseDown={stop} className="h-[calc(100%-44px)] w-full resize-none rounded-xl border-2 bg-white/70 p-3 font-mono text-xs outline-none transition focus:bg-white disabled:opacity-70" style={{ borderColor: `${style.accent}30` }} placeholder="https://..." />
        </div>
      );
    }

    if (card.type === "image") {
      if (isValidImageUrl(card.content) || (card.content && card.content.startsWith("data:image"))) {
        return <img src={card.content} alt={card.title || "Card image"} className="h-full w-full object-cover" draggable={false} />;
      }
      return <div className="grid h-full place-items-center" style={{ background: style.bg }}><div className="text-center"><div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-2xl" style={{ background: `${style.accent}20` }}><FileText className="h-6 w-6" style={{ color: style.accent }} /></div><div className="text-xs font-bold" style={{ color: style.accent }}>Paste image URL or upload</div></div></div>;
    }

    if (card.type === "checklist" || card.type === "todo") {
      const items = parseChecklist(card.content);
      const toggleItem = (idx) => {
        const updated = [...items];
        updated[idx].done = !updated[idx].done;
        const newContent = updated.map(it => `${it.done ? '[x]' : '[ ]'} ${it.text}`).join('\n');
        updateCard(card.id, { content: newContent });
      };
      const addTask = () => {
        if (!newTask.trim()) return;
        const newContent = card.content ? `${card.content}\n[ ] ${newTask.trim()}` : `[ ] ${newTask.trim()}`;
        updateCard(card.id, { content: newContent });
        setNewTask("");
      };
      const completed = items.filter(i => i.done).length;
      
      return (
        <div className="flex h-full flex-col" style={{ background: style.bg }}>
          <div className="flex items-center justify-between border-b-2 px-4 py-2.5" style={{ borderColor: `${style.accent}30`, background: 'white' }}>
            <div className="flex items-center gap-2">
              <div className="grid h-6 w-6 place-items-center rounded-md" style={{ background: style.accent }}><ListTodo className="h-3.5 w-3.5 text-white" /></div>
              <span className="text-xs font-black uppercase tracking-wider" style={{ color: style.accent }}>{style.label}</span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${style.accent}20`, color: style.accent }}>{completed}/{items.length}</span>
          </div>
          <div className="flex-1 overflow-auto px-3 py-2">
            {items.length === 0 && <div className="py-6 text-center text-xs" style={{ color: '#94A3B8' }}>No tasks yet. Add one below.</div>}
            {items.map((item, idx) => (
              <div key={idx} onClick={() => !card.locked && toggleItem(idx)} className="group flex cursor-pointer items-start gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-white">
                <button type="button" onMouseDown={stop} className="mt-0.5 shrink-0">
                  {item.done ? <CheckSquare className="h-[18px] w-[18px]" style={{ color: style.accent }} /> : <Square className="h-[18px] w-[18px] text-zinc-300 group-hover:text-zinc-400" />}
                </button>
                <span className={cn("flex-1 text-[13px] leading-snug", item.done && "line-through text-zinc-400")}>{item.text || <span className="italic text-zinc-400">Empty task</span>}</span>
              </div>
            ))}
          </div>
          {!card.locked && (
            <div className="border-t-2 px-3 py-2" style={{ borderColor: `${style.accent}20`, background: 'white' }}>
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 shrink-0" style={{ color: style.accent }} />
                <input value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTask()} onMouseDown={stop} placeholder="Add task..." className="w-full bg-transparent text-[13px] outline-none placeholder:text-zinc-400" />
              </div>
            </div>
          )}
        </div>
      );
    }

    // Default note/text
    return (
      <div className="h-full p-4" style={{ background: style.bg }}>
        <textarea value={card.content || ""} disabled={card.locked} onChange={(e) => updateCard(card.id, { content: e.target.value })} onMouseDown={stop} className="h-full w-full resize-none bg-transparent text-[14px] leading-relaxed outline-none placeholder:text-zinc-400 disabled:opacity-70" style={{ color: "#1E293B" }} placeholder="Start writing..." />
      </div>
    );
  };

  return (
    <>
      <div className="min-h-0 flex-1 overflow-hidden rounded-[inherit]">{renderContent()}</div>
      {(tags.length > 0 || card.nextBoard) && (
        <div className="flex flex-wrap items-center gap-1.5 border-t px-3 py-2" style={{ borderColor: 'rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.7)' }}>
          {tags.map((tag) => <span key={tag} className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: `${style.accent}15`, color: style.accent }}><Tags className="h-3 w-3" />{tag}</span>)}
          {card.nextBoard && (
            <button type="button" onMouseDown={stop} onClick={(e) => { e.stopPropagation(); goToBoard?.(card.nextBoard); }} className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white transition hover:opacity-90" style={{ background: style.accent }}>Go <ArrowRight className="h-3 w-3" /></button>
          )}
        </div>
      )}
    </>
  );
}
/* ── Main BoardCanvas ── */
export default function BoardCanvas({
  selectedProject, selectedBoard, dark, filteredCards = [],
  bringCardToFront, updateCard, openEditCardModal, toggleLockCard,
  duplicateCard, deleteCard, getCardType, goToBoard, openSubBoardForCard,
}) {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ w: 1200, h: 800 });
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [prefs, togglePref, setPref] = usePrefs();

  const selectedCard = useMemo(() => filteredCards.find((c) => c.id === selectedCardId) || null, [filteredCards, selectedCardId]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setSize({ w: el.clientWidth || 1200, h: el.clientHeight || 800 });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (selectedCardId && !filteredCards.some((c) => c.id === selectedCardId)) setSelectedCardId(null);
  }, [filteredCards, selectedCardId]);

  if (!selectedProject) return null;

  const bg = selectedProject?.palette?.background || "#F4F1EA";

  const getGrid = () => {
    if (!prefs.showGrid) return { backgroundColor: dark ? "#09090b" : bg };
    if (prefs.gridType === "lines") {
      const line = dark ? "rgba(82,82,91,0.35)" : "rgba(36,59,103,0.15)";
      return { backgroundImage: "linear-gradient(to right, " + line + " 1px, transparent 1px), linear-gradient(to bottom, " + line + " 1px, transparent 1px)", backgroundColor: dark ? "#09090b" : bg, backgroundSize: GRID_SIZE + "px " + GRID_SIZE + "px" };
    }
    const dot = dark ? "#52525b" : "rgba(36,59,103,0.25)";
    return { backgroundImage: "radial-gradient(circle at 1px 1px, " + dot + " 1.2px, transparent 0)", backgroundColor: dark ? "#09090b" : bg, backgroundSize: GRID_SIZE + "px " + GRID_SIZE + "px" };
  };

  const gridStyle = getGrid();

  const cycleGrid = () => {
    if (!prefs.showGrid) { setPref("showGrid", true); setPref("gridType", "dots"); }
    else if (prefs.gridType === "dots") { setPref("gridType", "lines"); }
    else { setPref("showGrid", false); setPref("gridType", "dots"); }
  };

  if (selectedBoard?.mode === "kanban") {
    return (
      <section ref={containerRef} className="relative flex-1 overflow-hidden" style={gridStyle}>
        <KanbanBoardView cards={filteredCards} updateCard={updateCard} openEditCardModal={openEditCardModal} deleteCard={deleteCard} duplicateCard={duplicateCard} />
      </section>
    );
  }

  const focusCard = (card, setTransform, targetScale = 1.08) => {
    if (!card) return;
    const s = clamp(targetScale, 0.25, 1.8);
    setTransform(-(card.x || 0) * s + size.w / 2 - ((card.w || 320) * s) / 2, -(card.y || 0) * s + size.h / 2 - ((card.h || 220) * s) / 2, s, 320, "easeOut");
  };

  const fitToCards = (setTransform) => {
    const b = getBounds(filteredCards);
    const s = clamp(Math.min(size.w / Math.max(b.width + 160, 1), size.h / Math.max(b.height + 160, 1), 1.15), 0.25, 1.15);
    setTransform(-b.minX * s + (size.w - b.width * s) / 2, -b.minY * s + (size.h - b.height * s) / 2, s, 360, "easeOut");
  };

  return (
    <section ref={containerRef} className="relative flex-1 overflow-hidden" style={gridStyle}>
      <TransformWrapper initialScale={0.85} minScale={0.25} maxScale={1.8} centerOnInit={false} limitToBounds={false} wheel={{ step: 0.001, smoothStep: 0.0004 }} pinch={{ step: 2 }} panning={{ velocityDisabled: true, disabled: false, excluded: ["button", "input", "textarea", "select", "a", "iframe", "card-drag-handle"] }} doubleClick={{ disabled: true }}>
        {({ zoomIn, zoomOut, resetTransform, state, setTransform }) => {
          const scale = state?.scale || 1;
          return (
            <>
              {/* Canvas Toolbar */}
              <div className="absolute left-1/2 top-4 z-[1000] flex -translate-x-1/2 items-center gap-2 rounded-2xl border p-2 shadow-lg backdrop-blur-xl" style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(38,49,66,0.12)", background: dark ? "rgba(15,23,42,0.92)" : "#FFFDf8ee" }}>
                <CanvasButton title="Zoom out" onClick={() => zoomOut()}><ZoomOut className="h-4 w-4" /></CanvasButton>
                <CanvasButton title="Zoom in" onClick={() => zoomIn()}><ZoomIn className="h-4 w-4" /></CanvasButton>
                <CanvasButton title="Fit all cards" onClick={() => fitToCards(setTransform)}><Maximize2 className="h-4 w-4" /> Fit</CanvasButton>
                <CanvasButton title="Reset view" onClick={() => resetTransform()}><RotateCcw className="h-4 w-4" /> Reset</CanvasButton>
                <div className="mx-1 h-6 w-px" style={{ background: dark ? "rgba(255,255,255,0.1)" : "rgba(38,49,66,0.12)" }} />
                <CanvasButton title={"Grid: " + (prefs.showGrid ? prefs.gridType : "off")} active={prefs.showGrid} onClick={cycleGrid}><Grid3X3 className="h-4 w-4" /> {prefs.showGrid ? (prefs.gridType === "dots" ? "Dots" : "Lines") : "Grid"}</CanvasButton>
                <CanvasButton title="Toggle snap" active={prefs.snapToGrid} onClick={() => togglePref("snapToGrid")}><Magnet className="h-4 w-4" /> Snap</CanvasButton>
                <CanvasButton title="Toggle minimap" active={prefs.showMinimap} onClick={() => togglePref("showMinimap")}><PanelRightOpen className="h-4 w-4" /></CanvasButton>
                <CanvasButton title="Focus mode" active={prefs.focusMode} onClick={() => togglePref("focusMode")}>{prefs.focusMode ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</CanvasButton>
              </div>

              {selectedCard && !prefs.focusMode && (
                <SelectedBar selectedCard={selectedCard} onEdit={() => openEditCardModal(selectedCard)} onDuplicate={() => duplicateCard(selectedCard.id)} onLock={() => toggleLockCard(selectedCard.id)} onDelete={() => deleteCard(selectedCard.id)} onFocus={() => focusCard(selectedCard, setTransform)} />
              )}

              {prefs.showMinimap && !prefs.focusMode && (
                <Minimap cards={filteredCards} selectedCardId={selectedCardId} state={state} setTransform={setTransform} size={size} />
              )}

              <TransformComponent wrapperStyle={{ width: "100%", height: "100%", cursor: "grab", touchAction: "none" }} contentStyle={{ width: CANVAS_SIZE + "px", height: CANVAS_SIZE + "px" }}>
                <div onMouseDown={() => setSelectedCardId(null)} style={{ position: "relative", width: CANVAS_SIZE + "px", height: CANVAS_SIZE + "px", background: "transparent" }}>
                  <ConnectionLines cards={filteredCards} />

                  {filteredCards.map((card) => {
                    const selected = selectedCardId === card.id;
                    const isTitle = card.type === "title";
                    const isDivider = card.type === "divider";
                    const isFolder = card.type === "folder";

                    const handleDoubleClick = (e) => {
                      const tgt = e.target;
                      if (["INPUT", "TEXTAREA", "BUTTON", "A", "IFRAME", "SELECT"].includes(tgt.tagName)) return;
                      e.preventDefault();
                      e.stopPropagation();
                      // ONLY folder cards open sub-boards. Everything else opens edit modal.
                      if (card.type === "folder") {
                        openSubBoardForCard?.(card);
                      } else {
                        openEditCardModal?.(card);
                      }
                    };

                    return (
                      <Rnd
                        key={card.id}
                        scale={scale}
                        size={{ width: card.w || 320, height: card.h || 220 }}
                        position={{ x: card.x || 0, y: card.y || 0 }}
                        dragHandleClassName={card.locked ? "" : "card-drag-handle"}
                        disableDragging={!!card.locked}
                        enableResizing={!card.locked}
                        minWidth={isDivider ? 280 : MIN_W}
                        minHeight={isDivider ? 48 : isFolder ? 160 : MIN_H}
                        cancel="input,textarea,button,select,a,iframe"
                        onMouseDown={(e) => { e.stopPropagation(); setSelectedCardId(card.id); bringCardToFront?.(card.id); }}
                        onDoubleClick={handleDoubleClick}
                        onDragStop={(e, d) => updateCard(card.id, { x: snap(d.x, prefs.snapToGrid), y: snap(d.y, prefs.snapToGrid) })}
                        onResizeStop={(e, dir, ref, delta, pos) => updateCard(card.id, { w: Math.max(isDivider ? 280 : MIN_W, snap(parseInt(ref.style.width, 10), prefs.snapToGrid)), h: Math.max(isDivider ? 48 : MIN_H, snap(parseInt(ref.style.height, 10), prefs.snapToGrid)), x: snap(pos.x, prefs.snapToGrid), y: snap(pos.y, prefs.snapToGrid) })}
                        style={{ zIndex: card.z || 1 }}
                        className="group"
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.16 }}
                          className={cn(
                            "relative flex h-full flex-col overflow-hidden transition",
                            isDivider ? "rounded-none border-0 bg-transparent p-0 shadow-none" : isTitle ? "rounded-[1.25rem] border-2 p-4 shadow-lg" : isFolder ? "rounded-[1.25rem] border-2 p-0 shadow-lg" : "rounded-[1.25rem] border p-3 shadow-md",
                            card.locked && "opacity-75",
                            selected && !isDivider && "ring-4 ring-[#8B7CF6]/50"
                          )}
                          style={{
                            background: isDivider ? "transparent" : isFolder ? (card.color ? card.color + "18" : "#eef2f9") : (card.color || "#FFFDF8"),
                            borderColor: selected ? "#8B7CF6" : isFolder ? (card.color || "#243B67") : "rgba(38,49,66,0.12)",
                          }}
                        >
                          {isDivider ? (
                            <div className="card-drag-handle flex h-full cursor-grab items-center gap-4">
                              <div className="h-px flex-1" style={{ background: "rgba(38,49,66,0.2)" }} />
                              <span className="rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-sm" style={{ borderColor: "rgba(38,49,66,0.12)", background: "#FFFDF8", color: "#7A7F8A" }}>{card.content || card.title || "Divider"}</span>
                              <div className="h-px flex-1" style={{ background: "rgba(38,49,66,0.2)" }} />
                              <div className="opacity-0 transition group-hover:opacity-100">
                                <CardActionButton title="Edit" onClick={() => openEditCardModal(card)}><Edit3 className="h-3.5 w-3.5" /></CardActionButton>
                                <CardActionButton danger title="Delete" onClick={() => deleteCard(card.id)}><X className="h-3.5 w-3.5" /></CardActionButton>
                              </div>
                            </div>
                          ) : isTitle ? (
                            <>
                              <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition group-hover:opacity-100">
                                <CardActionButton title="Edit" onClick={() => openEditCardModal(card)}><Edit3 className="h-3.5 w-3.5" /></CardActionButton>
                                <CardActionButton danger title="Delete" onClick={() => deleteCard(card.id)}><X className="h-3.5 w-3.5" /></CardActionButton>
                              </div>
                              <div className="card-drag-handle flex h-full cursor-grab flex-col justify-center">
                                <div className="text-xs font-bold uppercase tracking-wide" style={{ color: "#8B7CF6" }}>Title</div>
                                <div className="mt-1 rounded-xl px-4 py-3 text-3xl font-black tracking-tight" style={{ background: "rgba(255,253,248,0.5)", color: "#1E293B" }}>{card.content || card.title}</div>
                              </div>
                            </>
                          ) : isFolder ? (
                            <>
                              <div className="h-2 w-full shrink-0 rounded-t-[1.15rem]" style={{ background: card.color || "#243B67" }} />
                              <div className="flex flex-1 flex-col p-3">
                                <div className={cn("mb-2 flex items-center justify-between gap-2", !card.locked && "card-drag-handle cursor-grab active:cursor-grabbing")}>
                                  <div className="flex min-w-0 items-center gap-2">
                                    <FolderOpen className="h-5 w-5 shrink-0" style={{ color: card.color || "#243B67" }} />
                                    <input value={card.title || ""} disabled={card.locked} onChange={(e) => updateCard(card.id, { title: e.target.value })} onMouseDown={(e) => e.stopPropagation()} className="min-w-0 flex-1 truncate bg-transparent font-bold outline-none disabled:cursor-default" style={{ color: "#1E293B" }} placeholder="Untitled Folder" />
                                  </div>
                                  <div className="flex shrink-0 gap-0.5 opacity-0 transition group-hover:opacity-100">
                                    <CardActionButton title="Edit" onClick={() => openEditCardModal(card)}><Edit3 className="h-3.5 w-3.5" /></CardActionButton>
                                    <CardActionButton title="Duplicate" onClick={() => duplicateCard(card.id)}><Copy className="h-3.5 w-3.5" /></CardActionButton>
                                    <CardActionButton danger title="Delete" onClick={() => deleteCard(card.id)}><X className="h-3.5 w-3.5" /></CardActionButton>
                                  </div>
                                </div>
                                <CardBody card={card} updateCard={updateCard} goToBoard={goToBoard} openSubBoardForCard={openSubBoardForCard} />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className={cn("mb-2 flex items-center justify-between gap-2", !card.locked && "card-drag-handle cursor-grab active:cursor-grabbing")}>
                                <div className="flex min-w-0 flex-1 items-center gap-2">
                                  <CardIcon type={card.type} getCardType={getCardType} />
                                  <input value={card.title || ""} disabled={card.locked} onChange={(e) => updateCard(card.id, { title: e.target.value })} onMouseDown={(e) => e.stopPropagation()} className="min-w-0 flex-1 truncate bg-transparent font-bold outline-none disabled:cursor-default" style={{ color: "#1E293B" }} />
                                </div>
                                <div className="flex shrink-0 gap-0.5 opacity-0 transition group-hover:opacity-100">
                                  <CardActionButton title="Edit" onClick={() => openEditCardModal(card)}><Edit3 className="h-3.5 w-3.5" /></CardActionButton>
                                  <CardActionButton title={card.locked ? "Unlock" : "Lock"} onClick={() => toggleLockCard(card.id)}>{card.locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}</CardActionButton>
                                  <CardActionButton title="Duplicate" onClick={() => duplicateCard(card.id)}><Copy className="h-3.5 w-3.5" /></CardActionButton>
                                  <CardActionButton danger title="Delete" onClick={() => deleteCard(card.id)}><X className="h-3.5 w-3.5" /></CardActionButton>
                                </div>
                              </div>
                              <CardBody card={card} updateCard={updateCard} goToBoard={goToBoard} openSubBoardForCard={openSubBoardForCard} />
                            </>
                          )}
                        </motion.div>
                      </Rnd>
                    );
                  })}
                </div>
              </TransformComponent>
            </>
          );
        }}
      </TransformWrapper>
    </section>
  );
}
