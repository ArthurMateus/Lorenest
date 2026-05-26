import React, { useEffect, useRef, useState } from "react";
import {
  CheckSquare,
  Clock,
  Columns,
  Edit3,
  Film,
  FileText,
  Folder,
  FolderPlus,
  Grid,
  Home,
  Image,
  Kanban,
  Layout,
  Link,
  MapPin,
  Minus,
  MoreHorizontal,
  Palette,
  Plus,
  Quote,
  Search,
  Star,
  Trash2,
  User,
} from "lucide-react";
import { cn } from "../utils/helpers";

const TOOL_GROUPS = [
  {
    label: "Basic",
    tools: [
      { type: "text", label: "Text", icon: FileText },
      { type: "note", label: "Note", icon: FileText },
      { type: "image", label: "Image", icon: Image },
      { type: "link", label: "Link", icon: Link },
      { type: "todo", label: "To-do", icon: CheckSquare },
      { type: "divider", label: "Divider", icon: Minus },
    ],
  },
  {
    label: "Structure",
    tools: [
      { type: "folder", label: "Folder", icon: FolderPlus, accent: true },
      { type: "board", label: "Board", icon: Layout },
      { type: "column", label: "Column", icon: Columns },
      { type: "kanban", label: "Kanban", icon: Kanban },
    ],
  },
  {
    label: "Writing",
    tools: [
      { type: "character", label: "Character", icon: User },
      { type: "scene", label: "Scene", icon: Film },
      { type: "location", label: "Location", icon: MapPin },
      { type: "quote", label: "Quote", icon: Quote },
      { type: "timeline", label: "Timeline", icon: Clock },
    ],
  },
  {
    label: "Visual",
    tools: [
      { type: "color-palette", label: "Palette", icon: Palette },
      { type: "moodboard", label: "Moodboard", icon: Grid },
    ],
  },
];

export default function Sidebar({
  user,
  onLogout,
  onOpenAccount,
  folders = [],
  selectedProjectId,
  setSelectedProjectId,
  setSelectedBoardId,
  setShowDashboard,
  query = "",
  setQuery,
  setIsCreateProjectOpen,
  setIsCreateFolderOpen,
  onRenameProject,
  onDeleteProject,
  onRenameFolder,
  onDeleteFolder,
  toggleStarProject,
  showDashboard,
  onAddCard,
  dark = false,
}) {
  const [openMenu, setOpenMenu] = useState(null);
  const [toolsOpen, setToolsOpen] = useState(true);
  const menuRef = useRef(null);

  const bg = dark ? "#0F172A" : "#FFFDF8";
  const bgSoft = dark ? "#111827" : "#F4F1EA";
  const hover = dark ? "rgba(255,255,255,0.06)" : "#f0eef9";
  const border = dark
    ? "rgba(255,255,255,0.08)"
    : "rgba(38,49,66,0.08)";
  const strongBorder = dark
    ? "rgba(255,255,255,0.12)"
    : "rgba(38,49,66,0.12)";
  const ink = dark ? "#F8FAFC" : "#1E293B";
  const muted = dark ? "#94A3B8" : "#7A7F8A";
  const brand = dark ? "#C4B5FD" : "#243B67";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectProject = (project) => {
    setSelectedProjectId?.(project.id);
    setSelectedBoardId?.(project.boards?.[0]?.id);
    setShowDashboard?.(false);
    setOpenMenu(null);
  };

  return (
    <aside
      className="w-64 shrink-0 flex flex-col"
      style={{
        background: bg,
        borderRight: `1px solid ${border}`,
        color: ink,
      }}
    >
      <div className="px-4 pt-4 pb-2">
        <button
          type="button"
          onClick={onOpenAccount}
          className="text-left text-lg font-black tracking-tight"
          style={{ color: brand }}
          title="Account"
        >
          ✦ Lorenest
        </button>
      </div>

      <div className="px-3 pb-2">
        <div className="relative">
          <Search
            className="absolute left-2.5 top-2.5 h-4 w-4"
            style={{ color: muted }}
          />
          <input
            value={query}
            onChange={(e) => setQuery?.(e.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-xl border py-2 pl-8 pr-3 text-sm outline-none transition"
            style={{
              borderColor: strongBorder,
              background: bgSoft,
              color: ink,
            }}
          />
        </div>

        <button
          onClick={() => setShowDashboard?.(true)}
          className="mt-2 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition"
          style={{
            background: showDashboard ? "#243B67" : "transparent",
            color: showDashboard ? "#fff" : muted,
          }}
          onMouseEnter={(e) => {
            if (!showDashboard) e.currentTarget.style.background = hover;
          }}
          onMouseLeave={(e) => {
            if (!showDashboard) e.currentTarget.style.background = "transparent";
          }}
        >
          <Home className="h-4 w-4" />
          Dashboard
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-2 scrollbar-hide">
        {folders.map((folder) => (
          <div key={folder.id} className="mb-4">
            <div className="group mb-1 flex items-center justify-between px-1 py-1.5">
              <div className="flex min-w-0 items-center gap-2">
                <Folder
                  className="h-4 w-4 shrink-0"
                  style={{ color: folder.color || "#8B7CF6" }}
                  fill={folder.color || "#8B7CF6"}
                  fillOpacity={0.18}
                />
                <span
                  className="truncate text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: folder.color || "#8B7CF6" }}
                >
                  {folder.name}
                </span>
                <span
                  className="rounded-full px-1.5 text-[10px] font-bold"
                  style={{
                    background: dark ? "rgba(139,124,246,0.16)" : "#f0eef9",
                    color: dark ? "#C4B5FD" : "#8B7CF6",
                  }}
                >
                  {folder.projects?.length || 0}
                </span>
              </div>

              <div className="flex gap-0.5 opacity-0 transition group-hover:opacity-100">
                <button
                  onClick={() => onRenameFolder?.(folder.id)}
                  className="rounded-lg p-1"
                  title="Edit folder"
                  onMouseEnter={(e) => (e.currentTarget.style.background = hover)}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <Edit3 className="h-3 w-3" style={{ color: muted }} />
                </button>

                <button
                  onClick={() => onDeleteFolder?.(folder.id)}
                  className="rounded-lg p-1 hover:bg-red-50"
                  title="Delete folder"
                >
                  <Trash2 className="h-3 w-3" style={{ color: "#ef4444" }} />
                </button>
              </div>
            </div>

            {(folder.projects || [])
              .filter(
                (project) =>
                  !query ||
                  project.name.toLowerCase().includes(query.toLowerCase())
              )
              .sort((a, b) => (b.starred ? 1 : 0) - (a.starred ? 1 : 0))
              .map((project) => {
                const isActive = selectedProjectId === project.id && !showDashboard;

                return (
                  <div
                    key={project.id}
                    className="group relative mb-1"
                    ref={openMenu === project.id ? menuRef : null}
                  >
                    <button
                      onClick={() => handleSelectProject(project)}
                      className="w-full rounded-xl border px-3 py-2.5 pr-16 text-left text-sm transition"
                      style={{
                        background: isActive
                          ? dark
                            ? "rgba(139,124,246,0.18)"
                            : "#eef2f9"
                          : "transparent",
                        borderColor: isActive
                          ? dark
                            ? "rgba(139,124,246,0.25)"
                            : "rgba(36,59,103,0.15)"
                          : "transparent",
                        color: ink,
                        fontWeight: isActive ? 600 : 400,
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.background = hover;
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive)
                          e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {project.palette?.primary && (
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ background: project.palette.primary }}
                            />
                          )}
                          {project.palette?.secondary && (
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ background: project.palette.secondary }}
                            />
                          )}
                        </div>
                        <span className="truncate">{project.name}</span>
                      </div>
                    </button>

                    <div className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-0.5 opacity-0 transition group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStarProject?.(project.id);
                        }}
                        className="rounded-lg p-1"
                        title={project.starred ? "Unstar" : "Star"}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = dark
                            ? "rgba(245,158,11,0.12)"
                            : "#fdf8ee")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <Star
                          className="h-3.5 w-3.5"
                          fill={project.starred ? "#f59e0b" : "none"}
                          style={{
                            color: project.starred ? "#f59e0b" : muted,
                          }}
                        />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenu(openMenu === project.id ? null : project.id);
                        }}
                        className="rounded-lg p-1"
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = hover)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <MoreHorizontal
                          className="h-3.5 w-3.5"
                          style={{ color: muted }}
                        />
                      </button>
                    </div>

                    {openMenu === project.id && (
                      <div
                        className="absolute right-0 top-full z-50 mt-1 w-40 rounded-xl border p-1 shadow-lg"
                        style={{
                          background: bg,
                          borderColor: strongBorder,
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRenameProject?.(project.id);
                            setOpenMenu(null);
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs"
                          style={{ color: ink }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = hover)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          Edit project
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteProject?.(project.id);
                            setOpenMenu(null);
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

            <button
              onClick={() => setIsCreateProjectOpen?.(true)}
              className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed py-2 text-xs font-medium transition"
              style={{
                borderColor: strongBorder,
                color: muted,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = hover)}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <Plus className="h-3.5 w-3.5" />
              New Project
            </button>
          </div>
        ))}

        <button
          onClick={() => setIsCreateFolderOpen?.(true)}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold text-white transition hover:opacity-90"
          style={{ background: "#243B67" }}
        >
          <FolderPlus className="h-3.5 w-3.5" />
          New Folder
        </button>
      </div>

      {!showDashboard && (
        <div
          className="border-t"
          style={{
            borderColor: border,
          }}
        >
          <button
            onClick={() => setToolsOpen(!toolsOpen)}
            className="flex w-full items-center justify-between px-4 py-2.5 text-xs font-bold uppercase tracking-wider"
            style={{ color: brand }}
          >
            <span>✦ Add to Canvas</span>
            <span className="text-[10px]" style={{ color: muted }}>
              {toolsOpen ? "▾" : "▸"}
            </span>
          </button>

          {toolsOpen && (
            <div className="max-h-[260px] overflow-y-auto px-3 pb-3 scrollbar-hide">
              {TOOL_GROUPS.map((group) => (
                <div key={group.label} className="mb-2">
                  <div
                    className="mb-1 px-1 text-[9px] font-bold uppercase tracking-widest"
                    style={{ color: dark ? "#8A8F99" : "#A0A4AD" }}
                  >
                    {group.label}
                  </div>

                  <div className="grid grid-cols-3 gap-1">
                    {group.tools.map((tool) => {
                      const IconComp = tool.icon;

                      return (
                        <button
                          key={tool.type}
                          onClick={() => onAddCard?.(tool.type)}
                          className="flex flex-col items-center gap-1 rounded-lg py-2 text-[10px] font-medium transition"
                          style={{
                            color: tool.accent
                              ? dark
                                ? "#C4B5FD"
                                : "#243B67"
                              : dark
                              ? "#CBD5E1"
                              : "#7A7F8A",
                            background: tool.accent
                              ? dark
                                ? "rgba(139,124,246,0.16)"
                                : "#eef2f9"
                              : "transparent",
                            border: tool.accent
                              ? dark
                                ? "1px solid rgba(139,124,246,0.28)"
                                : "1px solid rgba(36,59,103,0.15)"
                              : "1px solid transparent",
                          }}
                          onMouseEnter={(e) => {
                            if (!tool.accent) e.currentTarget.style.background = hover;
                          }}
                          onMouseLeave={(e) => {
                            if (!tool.accent)
                              e.currentTarget.style.background = "transparent";
                          }}
                          title={`Add ${tool.label}`}
                        >
                          <IconComp className="h-4 w-4" />
                          {tool.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}