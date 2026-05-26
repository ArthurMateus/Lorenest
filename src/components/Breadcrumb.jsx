import React, { useMemo } from "react";
import { ChevronRight, FileText, Folder, Home } from "lucide-react";

export default function Breadcrumb({
  showDashboard,
  setShowDashboard,
  selectedProject,
  selectedBoard,
  boards = [],
  setSelectedBoardId,
  dark = false,
}) {
  const path = useMemo(() => {
    if (!selectedBoard) return [];

    const result = [];
    const visited = new Set();
    let current = selectedBoard;

    while (current) {
      if (visited.has(current.id)) break;
      visited.add(current.id);

      result.unshift(current);

      if (current.parentBoardId) {
        current = boards.find((board) => board.id === current.parentBoardId) || null;
      } else {
        current = null;
      }
    }

    return result;
  }, [selectedBoard, boards]);

  const surface = dark ? "#0F172A" : "#FFFDF8";
  const hover = dark ? "rgba(255,255,255,0.06)" : "#FAF7F0";
  const active = dark ? "rgba(139,124,246,0.14)" : "#fdf8ee";
  const ink = dark ? "#F8FAFC" : "#1E293B";
  const muted = dark ? "#94A3B8" : "#7A7F8A";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(38,49,66,0.12)";

  const goHome = () => {
    setShowDashboard?.(true);
  };

  const goProjectRoot = () => {
    const root =
      boards.find((board) => !board.parentBoardId && !board.parentCardId) ||
      boards[0];

    if (root) {
      setSelectedBoardId?.(root.id);
      setShowDashboard?.(false);
    }
  };

  const goBoard = (boardId) => {
    setSelectedBoardId?.(boardId);
    setShowDashboard?.(false);
  };

  const displayedPath = path.filter(
    (board, index) => !(index === 0 && !board.parentBoardId)
  );

  return (
    <nav
      className="flex items-center gap-1 overflow-x-auto px-4 py-2.5 scrollbar-hide"
      style={{ background: surface, borderBottom: `1px solid ${border}` }}
    >
      <button
        onClick={goHome}
        className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-bold"
        style={{
          color: showDashboard ? "#8B7CF6" : muted,
          background: showDashboard ? active : "transparent",
        }}
        onMouseEnter={(e) => {
          if (!showDashboard) e.currentTarget.style.background = hover;
        }}
        onMouseLeave={(e) => {
          if (!showDashboard) e.currentTarget.style.background = "transparent";
        }}
      >
        <Home className="h-4 w-4" />
        Home
      </button>

      {selectedProject && !showDashboard && (
        <>
          <ChevronRight
            className="h-3.5 w-3.5 shrink-0"
            style={{ color: muted }}
          />

          <button
            onClick={goProjectRoot}
            className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-bold"
            style={{
              color: displayedPath.length === 0 ? ink : muted,
              background: displayedPath.length === 0 ? active : "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = hover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                displayedPath.length === 0 ? active : "transparent";
            }}
          >
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{
                background: selectedProject.palette?.primary || "#243B67",
              }}
            />
            <span className="max-w-[180px] truncate">
              {selectedProject.name}
            </span>
          </button>
        </>
      )}

      {!showDashboard &&
        displayedPath.map((board, index) => {
          const isLast = index === displayedPath.length - 1;
          const Icon = board.parentBoardId ? Folder : FileText;

          return (
            <React.Fragment key={board.id}>
              <ChevronRight
                className="h-3.5 w-3.5 shrink-0"
                style={{ color: muted }}
              />

              <button
                onClick={() => {
                  if (!isLast) goBoard(board.id);
                }}
                className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm"
                style={{
                  color: isLast ? ink : muted,
                  background: isLast ? active : "transparent",
                  fontWeight: isLast ? 700 : 600,
                  cursor: isLast ? "default" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!isLast) e.currentTarget.style.background = hover;
                }}
                onMouseLeave={(e) => {
                  if (!isLast) e.currentTarget.style.background = "transparent";
                }}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="max-w-[180px] truncate">
                  {board.name || board.title || "Untitled Board"}
                </span>
              </button>
            </React.Fragment>
          );
        })}
    </nav>
  );
}