import React from "react";
import Breadcrumb from "./Breadcrumb";

export default function BoardTabs({
  boards = [],
  selectedBoard,
  selectedBoardId,
  setSelectedBoardId,
  addBoard,
  onRenameBoard,
  closeBoard,
  goBackFromSubBoard,
  showDashboard,
  setShowDashboard,
  selectedProject,
  dark = false,
}) {
  const surface = dark ? "#0F172A" : "#FFFDF8";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(38,49,66,0.12)";

  return (
    <div
      className="flex items-center"
      style={{
        background: surface,
        borderBottom: `1px solid ${border}`,
      }}
    >
      <div className="min-w-0 flex-1">
        <Breadcrumb
          showDashboard={showDashboard}
          setShowDashboard={setShowDashboard}
          selectedProject={selectedProject}
          selectedBoard={selectedBoard}
          boards={boards}
          setSelectedBoardId={setSelectedBoardId}
          dark={dark}
        />
      </div>
    </div>
  );
}
