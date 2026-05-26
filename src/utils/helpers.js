import {
  BookOpen,
  CalendarDays,
  CheckSquare,
  Code2,
  Columns3,
  FileText,
  Heading1,
  Image,
  KanbanSquare,
  Link as LinkIcon,
  ListTodo,
  Minus,
  Music,
  Quote,
  StickyNote,
  Table2,
  User,
} from "lucide-react";

export const cardTypes = [
  { type: "custom", label: "Text", icon: FileText },
  { type: "note", label: "Note", icon: StickyNote },
  { type: "title", label: "Title", icon: Heading1 },
  { type: "divider", label: "Divider", icon: Minus },
  { type: "checklist", label: "Checklist", icon: CheckSquare },
  { type: "todo", label: "To-do list", icon: ListTodo },
  { type: "kanban", label: "Kanban card", icon: KanbanSquare },
  { type: "table", label: "Table", icon: Table2 },
  { type: "timeline", label: "Timeline", icon: CalendarDays },
  { type: "code", label: "Code", icon: Code2 },
  { type: "character", label: "Character", icon: User },
  { type: "quote", label: "Quote", icon: Quote },
  { type: "image", label: "Image", icon: Image },
  { type: "spotify", label: "Spotify", icon: Music },
  { type: "pinterest", label: "Pinterest", icon: Image },
  { type: "link", label: "Link", icon: LinkIcon },
  { type: "synopsis", label: "Synopsis", icon: BookOpen },
];

export function getCardType(type) {
  return cardTypes.find((cardType) => cardType.type === type) || cardTypes[0];
}

export function getDefaultCardContent(type) {
  const defaults = {
    custom: "Write anything here...",
    note: "A clean note for ideas, observations, or references.",
    title: "Section title",
    divider: "Divider",
    checklist: "[ ] First task\n[ ] Second task\n[x] Completed example",
    todo: "[ ] Capture idea\n[ ] Expand concept\n[ ] Review later",
    kanban: "## Backlog\n- Idea one\n- Idea two\n\n## Doing\n- Current task\n\n## Done\n- Finished item",
    table: "Name | Status | Notes\nScene 1 | Draft | Opening beat\nScene 2 | Idea | Needs research",
    timeline: "2026-05-21 | First milestone | Short notes\n2026-05-22 | Next milestone | Short notes",
    code: "// Paste code or structured notes here\nfunction example() {\n  return 'hello';\n}",
    character: "Name:\nRole:\nTraits:\nGoals:\nConflict:",
    quote: "“A quote, reminder, or line of dialogue.”",
    image: "",
    spotify: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M",
    pinterest: "https://www.pinterest.com/pinterest/official-news/",
    link: "https://example.com",
    synopsis: "Short summary, plot idea, or project overview.",
  };
  return defaults[type] || "";
}

export function getDefaultCardSize(type) {
  const sizes = {
    title: { w: 520, h: 128 },
    divider: { w: 640, h: 74 },
    checklist: { w: 340, h: 280 },
    todo: { w: 340, h: 280 },
    kanban: { w: 600, h: 360 },
    table: { w: 560, h: 300 },
    timeline: { w: 460, h: 340 },
    code: { w: 480, h: 320 },
    image: { w: 380, h: 300 },
    spotify: { w: 390, h: 260 },
    pinterest: { w: 390, h: 320 },
    quote: { w: 360, h: 240 },
    synopsis: { w: 440, h: 280 },
  };
  return sizes[type] || { w: 320, h: 220 };
}

export function getDefaultCardColor(type, fallback = "#f5f3ff") {
  const colors = {
    title: "#ede9fe",
    divider: "#ffffff",
    checklist: "#ecfdf5",
    todo: "#ecfdf5",
    kanban: "#eff6ff",
    table: "#f8fafc",
    timeline: "#fff7ed",
    code: "#e0e7ff",
    quote: "#fdf2f8",
    image: "#ffffff",
    link: "#eef2ff",
    synopsis: "#fef3c7",
    character: "#f3e8ff",
    note: "#fff7ed",
  };
  return colors[type] || fallback;
}

export function isValidImageUrl(url) {
  return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url || "");
}

export function getSpotifyEmbedUrl(url) {
  if (!url) return null;
  try {
    const parsedUrl = new URL(url);
    const parts = parsedUrl.pathname.split("/").filter(Boolean);
    if (parts.length >= 2 && ["playlist", "album", "track", "artist"].includes(parts[0])) {
      return `https://open.spotify.com/embed/${parts[0]}/${parts[1]}?utm_source=generator&theme=0`;
    }
  } catch {
    return null;
  }
  return null;
}

export function getPinterestPinId(url) {
  if (!url) return null;
  return url.match(/pin\/(\d+)/)?.[1] || url.match(/[?&]pin=(\d+)/)?.[1] || null;
}

export const cn = (...classes) => classes.filter(Boolean).join(" ");
