import React from "react";
import { FolderPlus, Plus, Star } from "lucide-react";

export default function Dashboard({
  visibleProjects = [],
  setSelectedProjectId,
  setSelectedBoardId,
  setShowDashboard,
  onNewProject,
  onNewFolder,
  toggleStarProject,
  dark = false,
}) {
  const isEmpty = visibleProjects.length === 0;

  const bg = dark ? "#020617" : "#F4F1EA";
  const surface = dark ? "#0F172A" : "#FFFDF8";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(38,49,66,0.10)";
  const ink = dark ? "#F8FAFC" : "#1E293B";
  const muted = dark ? "#94A3B8" : "#7A7F8A";

  const openProject = (project) => {
    setSelectedProjectId?.(project.id);
    setSelectedBoardId?.(project.boards?.[0]?.id);
    setShowDashboard?.(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6" style={{ background: bg }}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1
              className="text-3xl font-black tracking-tight"
              style={{ color: ink }}
            >
              ✦ Lorenest
            </h1>
            <p className="mt-1 text-sm" style={{ color: muted }}>
              Your creative workspace for projects, worlds, characters, and
              ideas.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onNewFolder}
              className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold"
              style={{ borderColor: border, color: ink, background: surface }}
            >
              <FolderPlus className="h-4 w-4" />
              New Folder
            </button>

            <button
              onClick={onNewProject}
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-white"
              style={{ background: "#243B67" }}
            >
              <Plus className="h-4 w-4" />
              New Project
            </button>
          </div>
        </div>

        {isEmpty ? (
          <div
            className="rounded-2xl border border-dashed p-10 text-center"
            style={{ borderColor: border, background: surface }}
          >
            <div className="text-4xl">✦</div>
            <h2 className="mt-3 text-xl font-black" style={{ color: ink }}>
              Welcome to Lorenest
            </h2>
            <p className="mt-2 text-sm" style={{ color: muted }}>
              Create your first folder or project to start building your
              creative workspace.
            </p>

            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={onNewFolder}
                className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold"
                style={{ borderColor: border, color: ink, background: surface }}
              >
                <FolderPlus className="h-4 w-4" />
                Create Folder
              </button>

              <button
                onClick={onNewProject}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-white"
                style={{ background: "#243B67" }}
              >
                <Plus className="h-4 w-4" />
                Create Project
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProjects.map((project) => {
              const boardCount = project.boards?.length || 0;

              return (
                <div
                  key={project.id}
                  className="group relative cursor-pointer rounded-2xl border p-4 shadow-sm transition hover:shadow-md"
                  style={{ borderColor: border, background: surface }}
                  onClick={() => openProject(project)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStarProject?.(project.id);
                    }}
                    className="absolute right-3 top-3 rounded-lg p-1.5 opacity-0 transition group-hover:opacity-100"
                    title={project.starred ? "Unstar" : "Star"}
                  >
                    <Star
                      className="h-4 w-4"
                      fill={project.starred ? "#f59e0b" : "none"}
                      style={{
                        color: project.starred ? "#f59e0b" : muted,
                      }}
                    />
                  </button>

                  <h3 className="pr-8 text-sm font-black" style={{ color: ink }}>
                    {project.name}
                  </h3>

                  {project.folderName && (
                    <p className="mt-1 text-xs" style={{ color: muted }}>
                      {project.folderName}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex gap-1">
                      {project.palette?.primary && (
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ background: project.palette.primary }}
                        />
                      )}
                      {project.palette?.secondary && (
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ background: project.palette.secondary }}
                        />
                      )}
                      {project.palette?.accent && (
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ background: project.palette.accent }}
                        />
                      )}
                    </div>

                    <span
                      className="rounded-full px-2 py-1 text-[10px] font-bold"
                      style={{
                        background: dark
                          ? "rgba(139,124,246,0.14)"
                          : "#f0eef9",
                        color: dark ? "#C4B5FD" : "#8B7CF6",
                      }}
                    >
                      {boardCount} {boardCount === 1 ? "board" : "boards"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}