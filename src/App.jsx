import React, { useEffect, useMemo, useState } from "react";
import { cn, cardTypes, getCardType, getDefaultCardContent, getDefaultCardSize, getDefaultCardColor } from "./utils/helpers";
import CreateCardModal from "./components/CreateCardModal";
import EditCardModal from "./components/EditCardModal";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import BoardTabs from "./components/BoardTabs";
import BoardCanvas from "./components/BoardCanvas";
import PalettePanel from "./components/PalettePanel";
import ConfirmDialog from "./components/ConfirmDialog";
import CreateProjectModal from "./components/CreateProjectModal";
import CreateFolderModal from "./components/CreateFolderModal";
import EditProjectModal from "./components/EditProjectModal";
import EditFolderModal from "./components/EditFolderModal";
import RenameModal from "./components/RenameModal";
import TemplateLibraryModal from "./components/TemplateLibraryModal";
import LoginScreen from "./components/LoginScreen";
import UserMenu from "./components/UserMenu";
import AccountSettingsModal from "./components/AccountSettingsModal";

import { Library, Moon, Plus, Redo2, Star, Sun, Trash2, Undo2 } from "lucide-react";
import { defaultTemplates } from "./data/templates";
import { supabase } from "./lib/supabase";

/* ══════════════════════════════════════════════
   Constants & Utilities
   ══════════════════════════════════════════════ */

const STORAGE_KEY = "lorenest.workspace.v4";
const TEMPLATE_STORAGE_KEY = "lorenest.templates.v2";

const makeId = (prefix = "id") => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

const SIDEBAR_CARD_LABELS = {
  text: "Text",
  note: "Note",
  image: "Image",
  link: "Link",
  todo: "To-do list",
  checklist: "Checklist",
  divider: "Divider",
  folder: "Untitled Folder",
  board: "Board Card",
  column: "Column",
  kanban: "Kanban Card",
  character: "New Character",
  scene: "New Scene",
  location: "New Location",
  quote: "Quote",
  timeline: "Timeline",
  "color-palette": "Color Palette",
  moodboard: "Moodboard",
};

const normalizeSidebarCardType = (type) => {
  if (type === "text") return "note";
  if (type === "todo") return "checklist";
  if (type === "color-palette") return "palette";
  if (type === "moodboard") return "image";
  return type || "note";
};

const createStarterWorkspace = () => {
  const now = new Date().toISOString();
  const rootBoardId = makeId("board");
  const projectId = makeId("project");
  const folderId = makeId("folder");

  return [
    {
      id: folderId,
      name: "Writing Projects",
      color: "#8B7CF6",
      createdAt: now,
      updatedAt: now,
      projects: [
        {
          id: projectId,
          name: "New Project",
          folderId,
          folderName: "Writing Projects",
          starred: false,
          status: "Planning",
          palette: {
            primary: "#7c3aed",
            secondary: "#a855f7",
            accent: "#ec4899",
            background: "#F4F1EA",
          },
          createdAt: now,
          updatedAt: now,
          boards: [
            {
              id: rootBoardId,
              name: "Overview",
              title: "Overview",
              mode: "canvas",
              boardType: "root",
              parentBoardId: null,
              parentCardId: null,
              createdAt: now,
              updatedAt: now,
              cards: [
                {
                  id: makeId("card"),
                  type: "note",
                  title: "Welcome to Lorenest",
                  content:
                    "Use the sidebar tools to add notes, folders, characters, scenes, links, images, and more.",
                  tags: [],
                  color: "#FFFDF8",
                  x: 120,
                  y: 120,
                  w: 340,
                  h: 200,
                  z: 1,
                  createdAt: now,
                  updatedAt: now,
                },
                {
                  id: makeId("card"),
                  type: "folder",
                  title: "Start Here",
                  content: "Double-click or press Open to enter this folder.",
                  tags: [],
                  color: "#243B67",
                  x: 500,
                  y: 120,
                  w: 300,
                  h: 210,
                  z: 2,
                  createdAt: now,
                  updatedAt: now,
                },
              ],
            },
          ],
        },
      ],
    },
  ];
};

function flattenProjects(folders = []) {
  return folders.flatMap((folder) =>
    (folder.projects || []).map((project) => ({
      ...project,
      folderId: folder.id,
      folderName: folder.name,
    }))
  );
}

function cloneCards(cards = []) {
  return cards.map((card) => ({
    ...card,
    id: makeId("card"),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

/* ══════════════════════════════════════════════
   Main App Component
   ══════════════════════════════════════════════ */

export default function App() {
  const [showAddMenu, setShowAddMenu] = useState(false);
  /* ── Theme ── */
  const [dark, setDark] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("lorenest.dark")) || false;
    } catch {
      return false;
    }
  });

  /* ── Auth ── */
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState(null);

  /* ── Data ── */
  const [folders, setFolders] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(saved) && saved.length > 0
        ? saved
        : createStarterWorkspace();
    } catch {
      return createStarterWorkspace();
    }
  });

  const [templates, setTemplates] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(TEMPLATE_STORAGE_KEY));
      return Array.isArray(saved) ? saved : defaultTemplates || [];
    } catch {
      return defaultTemplates || [];
    }
  });

  const visibleProjects = useMemo(() => flattenProjects(folders), [folders]);

  /* ── Selection ── */
  const [selectedProjectId, setSelectedProjectId] = useState(() => {
    const projects = flattenProjects(folders);
    return projects[0]?.id || null;
  });

  const selectedProject = useMemo(
    () => visibleProjects.find((p) => p.id === selectedProjectId) || null,
    [visibleProjects, selectedProjectId]
  );

  const [selectedBoardId, setSelectedBoardId] = useState(() => {
    const projects = flattenProjects(folders);
    return projects[0]?.boards?.[0]?.id || null;
  });

  const selectedBoard = useMemo(() => {
    if (!selectedProject) return null;
    return (
      selectedProject.boards?.find((b) => b.id === selectedBoardId) ||
      selectedProject.boards?.[0] ||
      null
    );
  }, [selectedProject, selectedBoardId]);

  /* ── UI State ── */
  const [showDashboard, setShowDashboard] = useState(true);
  const [query, setQuery] = useState("");
  const [isCreateCardOpen, setIsCreateCardOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [editFolder, setEditFolder] = useState(null);
  const [editingCard, setEditingCard] = useState(null);

  const [renameBoardModal, setRenameBoardModal] = useState({
    isOpen: false,
    id: null,
    name: "",
  });

  const [templateNameModal, setTemplateNameModal] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    danger: false,
    onConfirm: null,
  });

  const [templateConfirm, setTemplateConfirm] = useState({
    isOpen: false,
    template: null,
  });

  const [cardDraft, setCardDraft] = useState({
    type: "note",
    title: "Untitled Card",
    content: "",
    color: "#FFFDF8",
  });

  /* ── History ── */
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  /* ══════════════════════════════════════════════
     Effects
     ══════════════════════════════════════════════ */

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(folders));
    } catch {}
  }, [folders]);

  useEffect(() => {
    try {
      localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
    } catch {}
  }, [templates]);

  useEffect(() => {
    try {
      localStorage.setItem("lorenest.dark", JSON.stringify(dark));
    } catch {}
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const su = data?.session?.user;
        if (mounted && su) {
          setUser({
            id: su.id,
            email: su.email,
            name:
              su.user_metadata?.name ||
              su.user_metadata?.full_name ||
              su.email ||
              "Writer",
            avatar: su.user_metadata?.avatar_url,
          });
        }
      } catch {
        if (mounted) setUser({ id: "local", email: "local", name: "Writer" });
      } finally {
        if (mounted) setAuthReady(true);
      }
    };

    init();

    let subscription;
    try {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        const su = session?.user;
        if (su) {
          setUser({
            id: su.id,
            email: su.email,
            name:
              su.user_metadata?.name ||
              su.user_metadata?.full_name ||
              su.email ||
              "Writer",
            avatar: su.user_metadata?.avatar_url,
          });
        } else {
          setUser(null);
        }
      });
      subscription = data?.subscription;
    } catch {}

    return () => {
      mounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (!selectedProjectId && visibleProjects[0]) {
      setSelectedProjectId(visibleProjects[0].id);
      setSelectedBoardId(visibleProjects[0].boards?.[0]?.id || null);
    }
  }, [selectedProjectId, visibleProjects]);

  useEffect(() => {
    if (selectedProject && !selectedBoardId) {
      setSelectedBoardId(selectedProject.boards?.[0]?.id || null);
    }
  }, [selectedProject, selectedBoardId]);

  /* ══════════════════════════════════════════════
     Core updaters
     ══════════════════════════════════════════════ */

  const updateFoldersWithHistory = (updater) => {
    setFolders((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      setHistory((h) => {
        const trimmed = h.slice(0, historyIndex + 1);
        return [...trimmed, prev];
      });
      setHistoryIndex((i) => i + 1);
      return next;
    });
  };

  const updateProject = (updater) => {
    if (!selectedProjectId) return;
    updateFoldersWithHistory((prevFolders) =>
      prevFolders.map((folder) => ({
        ...folder,
        projects: (folder.projects || []).map((project) => {
          if (project.id !== selectedProjectId) return project;
          return typeof updater === "function" ? updater(project) : updater;
        }),
      }))
    );
  };

  const updateBoard = (boardId, updater) => {
    updateProject((project) => ({
      ...project,
      boards: (project.boards || []).map((board) => {
        if (board.id !== boardId) return board;
        return typeof updater === "function" ? updater(board) : updater;
      }),
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateCard = (cardId, patch) => {
    if (!selectedBoard) return;
    const existingCard = selectedBoard.cards?.find((c) => c.id === cardId);
    updateBoard(selectedBoard.id, (board) => ({
      ...board,
      updatedAt: new Date().toISOString(),
      cards: (board.cards || []).map((card) =>
        card.id === cardId
          ? { ...card, ...patch, updatedAt: new Date().toISOString() }
          : card
      ),
    }));
    // Sync folder name to child board
    if (existingCard?.type === "folder" && patch.title && existingCard.childBoardId) {
      updateBoard(existingCard.childBoardId, (board) => ({
        ...board,
        name: patch.title,
        title: patch.title,
        updatedAt: new Date().toISOString(),
      }));
    }
  };

  /* ══════════════════════════════════════════════
     Card operations
     ══════════════════════════════════════════════ */

  const bringCardToFront = (cardId) => updateCard(cardId, { z: Date.now() });

  const openEditCardModal = (card) => setEditingCard(card);

  const toggleLockCard = (cardId) => {
    const card = selectedBoard?.cards?.find((c) => c.id === cardId);
    if (card) updateCard(cardId, { locked: !card.locked });
  };

  const duplicateCard = (cardId) => {
    const card = selectedBoard?.cards?.find((c) => c.id === cardId);
    if (!card || !selectedBoard) return;
    const dup = {
      ...card,
      id: makeId("card"),
      title: `${card.title || "Untitled"} copy`,
      x: (card.x || 0) + 36,
      y: (card.y || 0) + 36,
      z: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    updateBoard(selectedBoard.id, (board) => ({
      ...board,
      cards: [...(board.cards || []), dup],
      updatedAt: new Date().toISOString(),
    }));
  };

  const deleteCard = (cardId) => {
    if (!selectedBoard) return;
    updateBoard(selectedBoard.id, (board) => ({
      ...board,
      cards: (board.cards || []).filter((c) => c.id !== cardId),
      updatedAt: new Date().toISOString(),
    }));
  };

  const createCardFromDraft = () => {
    if (!selectedBoard) return;
    const type = cardDraft.type || "note";
    const size = getDefaultCardSize?.(type) || { w: 300, h: 200 };
    const now = new Date().toISOString();
    
    // Bulk folder creation - type "Annelise, Viktor, August"
    if (type === "folder" && cardDraft.title && /[,\n]/.test(cardDraft.title)) {
      const names = cardDraft.title.split(/[,\\n]+/).map(n => n.trim()).filter(Boolean);
      const newCards = names.map((name, i) => ({
        id: makeId("card"),
        type,
        title: name,
        content: cardDraft.content || "Open this folder to create a nested board.",
        tags: typeof cardDraft.tags === "string" ? cardDraft.tags.split(",").map(t => t.trim()).filter(Boolean) : (cardDraft.tags || []),
        color: cardDraft.color || getDefaultCardColor?.(type) || "#243B67",
        x: 140 + (i % 4) * 300,
        y: 140 + Math.floor(i / 4) * 210,
        w: size.w || 280,
        h: size.h || 190,
        z: Date.now() + i,
        createdAt: now,
        updatedAt: now,
      }));
      updateBoard(selectedBoard.id, board => ({
        ...board,
        cards: [...(board.cards || []), ...newCards],
        updatedAt: now,
      }));
      setIsCreateCardOpen(false);
      return;
    }
    
    const card = {
      id: makeId("card"),
      type,
      title: cardDraft.title || "Untitled Card",
      content: cardDraft.content || getDefaultCardContent?.(type) || "",
      tags: typeof cardDraft.tags === "string" ? cardDraft.tags.split(",").map(t => t.trim()).filter(Boolean) : (cardDraft.tags || []),
      color: cardDraft.color || getDefaultCardColor?.(type) || "#FFFDF8",
      x: 140,
      y: 140,
      w: size.w || 300,
      h: size.h || 200,
      z: Date.now(),
      createdAt: now,
      updatedAt: now,
    };
    updateBoard(selectedBoard.id, (board) => ({
      ...board,
      cards: [...(board.cards || []), card],
      updatedAt: now,
    }));
    setIsCreateCardOpen(false);
  };

  /* ── Sidebar card creation ── */
  const addCardFromSidebar = (rawType) => {
    if (showDashboard || !selectedProject || !selectedBoard) return;
    const type = normalizeSidebarCardType(rawType);
    const now = new Date().toISOString();
    const fallbackSize = {
      w: type === "divider" ? 420 : type === "folder" ? 280 : 300,
      h: type === "divider" ? 60 : type === "folder" ? 190 : 200,
    };
    const size = getDefaultCardSize?.(type) || fallbackSize;
    const cardCount = selectedBoard.cards?.length || 0;
    const newCard = {
      id: makeId("card"),
      type,
      title:
        SIDEBAR_CARD_LABELS[rawType] ||
        SIDEBAR_CARD_LABELS[type] ||
        "Untitled Card",
      content:
        type === "folder"
          ? "Open this folder to create a nested board."
          : getDefaultCardContent?.(type) || "",
      tags: [],
      color:
        type === "folder"
          ? "#243B67"
          : getDefaultCardColor?.(type) || "#FFFDF8",
      x: 120 + (cardCount % 5) * 36,
      y: 120 + (cardCount % 5) * 36,
      w: size.w || 300,
      h: size.h || 200,
      z: Date.now(),
      createdAt: now,
      updatedAt: now,
    };
    updateBoard(selectedBoard.id, (board) => ({
      ...board,
      updatedAt: now,
      cards: [...(board.cards || []), newCard],
    }));
  };

  /* ── Sub-board navigation (folders only) ── */
  const openSubBoardForCard = (card) => {
    if (!card || !selectedProject || !selectedBoard) return;
    if (card.type !== "folder") return;

    const existingChild = selectedProject.boards?.find(
      (b) => b.id === card.childBoardId
    );
    if (existingChild) {
      setSelectedBoardId(existingChild.id);
      setShowDashboard(false);
      return;
    }

    const now = new Date().toISOString();
    const childBoardId = makeId("board");
    const childBoard = {
      id: childBoardId,
      name: card.title || "Untitled Folder",
      title: card.title || "Untitled Folder",
      mode: "canvas",
      boardType: "folder",
      parentBoardId: selectedBoard.id,
      parentCardId: card.id,
      cards: [],
      createdAt: now,
      updatedAt: now,
    };
    updateProject((project) => ({
      ...project,
      boards: [
        ...(project.boards || []).map((board) => {
          if (board.id !== selectedBoard.id) return board;
          return {
            ...board,
            updatedAt: now,
            cards: (board.cards || []).map((c) =>
              c.id === card.id
                ? { ...c, childBoardId, updatedAt: now }
                : c
            ),
          };
        }),
        childBoard,
      ],
      updatedAt: now,
    }));
    setSelectedBoardId(childBoardId);
    setShowDashboard(false);
  };

  const goToBoard = (boardId) => {
    if (!boardId) return;
    setSelectedBoardId(boardId);
    setShowDashboard(false);
  };

  const goBackFromSubBoard = () => {
    if (!selectedBoard?.parentBoardId) return;
    setSelectedBoardId(selectedBoard.parentBoardId);
    setShowDashboard(false);
  };

  /* ══════════════════════════════════════════════
     Board operations
     ══════════════════════════════════════════════ */

  const addBoard = (mode = "canvas") => {
    if (!selectedProject) return;
    const now = new Date().toISOString();
    const boardId = makeId("board");
    const board = {
      id: boardId,
      name: mode === "kanban" ? "New Kanban Board" : "New Board",
      title: mode === "kanban" ? "New Kanban Board" : "New Board",
      mode,
      boardType: mode,
      parentBoardId: null,
      parentCardId: null,
      cards: [],
      createdAt: now,
      updatedAt: now,
    };
    updateProject((project) => ({
      ...project,
      boards: [...(project.boards || []), board],
      updatedAt: now,
    }));
    setSelectedBoardId(boardId);
    setShowDashboard(false);
  };

  const closeBoard = (boardId) => {
    if (!selectedProject || selectedProject.boards?.length <= 1) return;
    updateProject((project) => ({
      ...project,
      boards: (project.boards || []).filter((b) => b.id !== boardId),
      updatedAt: new Date().toISOString(),
    }));
    if (selectedBoardId === boardId) {
      const fb = selectedProject.boards?.find((b) => b.id !== boardId);
      setSelectedBoardId(fb?.id || null);
    }
  };

  const clearBoard = () => {
    if (!selectedBoard) return;
    setConfirmDialog({
      isOpen: true,
      title: "Clear board?",
      message: "This will remove all cards from the current board.",
      confirmText: "Clear",
      danger: true,
      onConfirm: () => {
        updateBoard(selectedBoard.id, (board) => ({
          ...board,
          cards: [],
          updatedAt: new Date().toISOString(),
        }));
        setConfirmDialog((prev) => ({
          ...prev,
          isOpen: false,
          onConfirm: null,
        }));
      },
    });
  };

  /* ══════════════════════════════════════════════
     Folder / Project CRUD
     ══════════════════════════════════════════════ */

  const handleCreateFolder = (folder) => {
    const now = new Date().toISOString();
    const newFolder = {
      id: makeId("folder"),
      name: folder.name || "New Folder",
      color: folder.color || "#8B7CF6",
      createdAt: now,
      updatedAt: now,
      projects: [],
    };
    updateFoldersWithHistory((prev) => [...prev, newFolder]);
    setIsCreateFolderOpen(false);
  };

  const handleCreateProject = (draft) => {
    const now = new Date().toISOString();
    const targetFolderId = draft.folderId || folders[0]?.id || makeId("folder");
    const rootBoardId = makeId("board");
    const projectId = makeId("project");
    const newProject = {
      id: projectId,
      name: draft.name || "New Project",
      folderId: targetFolderId,
      folderName:
        folders.find((f) => f.id === targetFolderId)?.name || "Projects",
      starred: false,
      status: draft.status || "Planning",
      palette: draft.palette || {
        primary: "#243B67",
        secondary: "#8B7CF6",
        accent: "#A7B89A",
        background: "#F4F1EA",
      },
      createdAt: now,
      updatedAt: now,
      boards: [
        {
          id: rootBoardId,
          name: "Overview",
          title: "Overview",
          mode: "canvas",
          boardType: "root",
          parentBoardId: null,
          parentCardId: null,
          cards: [],
          createdAt: now,
          updatedAt: now,
        },
      ],
    };
    updateFoldersWithHistory((prev) => {
      let found = false;
      const next = prev.map((folder) => {
        if (folder.id !== targetFolderId) return folder;
        found = true;
        return {
          ...folder,
          updatedAt: now,
          projects: [...(folder.projects || []), newProject],
        };
      });
      if (found) return next;
      return [
        ...next,
        {
          id: targetFolderId,
          name: "Projects",
          color: "#8B7CF6",
          createdAt: now,
          updatedAt: now,
          projects: [newProject],
        },
      ];
    });
    setSelectedProjectId(projectId);
    setSelectedBoardId(rootBoardId);
    setShowDashboard(false);
    setIsCreateProjectOpen(false);
  };

  const handleEditProjectSave = (updated) => {
    if (!updated) return;
    updateFoldersWithHistory((prev) =>
      prev.map((folder) => ({
        ...folder,
        projects: (folder.projects || []).map((p) =>
          p.id === updated.id
            ? { ...p, ...updated, updatedAt: new Date().toISOString() }
            : p
        ),
      }))
    );
    setEditProject(null);
  };

  const handleEditFolderSave = (updated) => {
    if (!updated) return;
    updateFoldersWithHistory((prev) =>
      prev.map((f) =>
        f.id === updated.id
          ? { ...f, ...updated, updatedAt: new Date().toISOString() }
          : f
      )
    );
    setEditFolder(null);
  };

  const deleteProject = (projectOrId) => {
    const pid = typeof projectOrId === "string" ? projectOrId : projectOrId?.id;
    if (!pid) return;
    updateFoldersWithHistory((prev) =>
      prev.map((folder) => ({
        ...folder,
        projects: (folder.projects || []).filter((p) => p.id !== pid),
      }))
    );
    if (selectedProjectId === pid) {
      const remaining = visibleProjects.filter((p) => p.id !== pid);
      setSelectedProjectId(remaining[0]?.id || null);
      setSelectedBoardId(remaining[0]?.boards?.[0]?.id || null);
      setShowDashboard(true);
    }
  };

  const deleteFolder = (folderOrId) => {
    const fid = typeof folderOrId === "string" ? folderOrId : folderOrId?.id;
    if (!fid) return;
    updateFoldersWithHistory((prev) => prev.filter((f) => f.id !== fid));
    setEditFolder(null);
  };

  const toggleStarProject = (projectId) => {
    updateFoldersWithHistory((prev) =>
      prev.map((folder) => ({
        ...folder,
        projects: (folder.projects || []).map((p) =>
          p.id === projectId
            ? { ...p, starred: !p.starred, updatedAt: new Date().toISOString() }
            : p
        ),
      }))
    );
  };

  /* ══════════════════════════════════════════════
     Template operations
     ══════════════════════════════════════════════ */

  const applyTemplate = (template) => {
    if (!selectedBoard || !template) return;
    setTemplateConfirm({ isOpen: true, template });
  };

  const doApplyTemplate = (template, replace = false) => {
    if (!selectedBoard || !template) return;
    const now = new Date().toISOString();
    const cards = cloneCards(template.cards || []).map((card, i) => ({
      ...card,
      id: makeId("card"),
      z: Date.now() + i,
      createdAt: now,
      updatedAt: now,
    }));
    updateBoard(selectedBoard.id, (board) => ({
      ...board,
      cards: replace ? cards : [...(board.cards || []), ...cards],
      updatedAt: now,
    }));
    setTemplateConfirm({ isOpen: false, template: null });
    setIsTemplateOpen(false);
  };

  const saveCurrentAsTemplate = (name) => {
    if (!selectedBoard || !name) return;
    const tpl = {
      id: makeId("template"),
      name,
      icon: "\u2728",
      description: "Saved from current board",
      custom: true,
      cards: (selectedBoard.cards || []).map((c) => ({ ...c, id: undefined })),
    };
    setTemplates((prev) => [tpl, ...prev]);
    setTemplateNameModal(false);
  };

  const deleteTemplate = (templateId) => {
    setTemplates((prev) => prev.filter((t) => t.id !== templateId));
  };

  /* ── Undo ── */
  const undo = () => {
    if (historyIndex < 0) return;
    const previous = history[historyIndex];
    if (!previous) return;
    setFolders(previous);
    setHistoryIndex((i) => i - 1);
  };

  /* ── Auth ── */
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    setUser(null);
  };

  /* ══════════════════════════════════════════════
     Render
     ══════════════════════════════════════════════ */

  if (!authReady) {
    return (
      <div className="grid min-h-screen place-items-center bg-zinc-950 text-white">
        Loading Lorenest...
      </div>
    );
  }

  if (!user) {
    return <LoginScreen dark={dark} setDark={setDark} />;
  }

  const borderColor = dark
    ? "rgba(255,255,255,0.08)"
    : "rgba(38,49,66,0.10)";
  const headerBg = dark ? "#0F172A" : "#FFFDF8";

  return (
    <div className={dark ? "dark" : ""}>
      <div
        className="flex h-screen overflow-hidden"
        style={{
          background: dark ? "#020617" : "#F4F1EA",
          color: dark ? "#F8FAFC" : "#1E293B",
        }}
      >
        {/* ── Sidebar ── */}
        <Sidebar
          user={user}
          onLogout={handleLogout}
          onOpenAccount={() => setIsAccountOpen(true)}
          folders={folders}
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
          setSelectedBoardId={setSelectedBoardId}
          setShowDashboard={setShowDashboard}
          query={query}
          setQuery={setQuery}
          setIsCreateProjectOpen={setIsCreateProjectOpen}
          setIsCreateFolderOpen={setIsCreateFolderOpen}
          onRenameProject={(pid) => {
            const p = visibleProjects.find((x) => x.id === pid);
            setEditProject(p || null);
          }}
          onDeleteProject={deleteProject}
          onRenameFolder={(fid) => {
            const f = folders.find((x) => x.id === fid);
            setEditFolder(f || null);
          }}
          onDeleteFolder={deleteFolder}
          toggleStarProject={toggleStarProject}
          showDashboard={showDashboard}
          dark={dark}
          onAddCard={addCardFromSidebar}
        />

        {/* ── Main Area ── */}
        <main className="flex min-w-0 flex-1 flex-col">
          {showDashboard ? (
            <>
              {/* Dashboard header */}
              <div
                className="flex items-center justify-between border-b px-4 py-3"
                style={{ background: headerBg, borderColor }}
              >
                <div>
                  <h2 className="text-sm font-black">Dashboard</h2>
                  <p className="text-xs opacity-70">
                    {visibleProjects.length}{" "}
                    {visibleProjects.length === 1 ? "project" : "projects"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsCreateFolderOpen(true)}
                    className="hidden rounded-xl border px-3 py-2 text-sm font-bold sm:inline-flex"
                    style={{ borderColor }}
                  >
                    New Folder
                  </button>
                  <button
                    onClick={() => setIsCreateProjectOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-bold text-white"
                    style={{ background: selectedProject?.palette?.primary || "#7c3aed" }}
                  >
                    <Plus className="h-4 w-4" />
                    New Project
                  </button>
                  <UserMenu
                    user={user}
                    onLogout={handleLogout}
                    onOpenAccount={() => setIsAccountOpen(true)}
                    onOpenSettings={() => setIsAccountOpen(true)}
                  />
                  <button
                    onClick={() => setDark((v) => !v)}
                    className="rounded-xl border p-2"
                    style={{ borderColor }}
                    title={dark ? "Light mode" : "Dark mode"}
                  >
                    {dark ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Dashboard
                visibleProjects={visibleProjects}
                setSelectedProjectId={setSelectedProjectId}
                setSelectedBoardId={setSelectedBoardId}
                setShowDashboard={setShowDashboard}
                onNewProject={() => setIsCreateProjectOpen(true)}
                onNewFolder={() => setIsCreateFolderOpen(true)}
                toggleStarProject={toggleStarProject}
                dark={dark}
              />
            </>
          ) : (
            <>
              {/* Board header */}
              <div
                className="flex items-center justify-between border-b px-4 py-3"
                style={{ background: headerBg, borderColor }}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    onClick={() =>
                      selectedProject &&
                      toggleStarProject(selectedProject.id)
                    }
                    className="rounded-xl p-1.5"
                    title={
                      selectedProject?.starred
                        ? "Unstar project"
                        : "Star project"
                    }
                  >
                    <Star
                      className="h-4 w-4"
                      fill={selectedProject?.starred ? "#f59e0b" : "none"}
                      style={{
                        color: selectedProject?.starred
                          ? "#f59e0b"
                          : "#94A3B8",
                      }}
                    />
                  </button>
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-black">
                      {selectedProject?.name || "Project"}
                    </h2>
                    <p className="truncate text-xs opacity-70">
                      {selectedBoard?.name ||
                        selectedBoard?.title ||
                        "Board"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={undo}
                    disabled={historyIndex < 0}
                    className="rounded-xl border px-2.5 py-2 text-sm disabled:opacity-40"
                    style={{ borderColor }}
                    title="Undo"
                  >
                    <Undo2 className="h-4 w-4" />
                  </button>
                  <button
                    disabled
                    className="rounded-xl border px-2.5 py-2 text-sm disabled:opacity-40"
                    style={{ borderColor }}
                    title="Redo"
                  >
                    <Redo2 className="h-4 w-4" />
                  </button>
                  <div className="relative">
                  <button
                    onClick={() => setShowAddMenu(!showAddMenu)}
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-white shadow-sm hover:opacity-90 transition"
                    style={{ background: selectedProject?.palette?.primary || "#7c3aed" }}
                  >
                    <Plus className="h-4 w-4" />
                    Add Card
                  </button>
                  {showAddMenu && (
                    <div className="absolute right-0 top-11 z-[5000] w-56 overflow-hidden rounded-2xl border bg-white shadow-xl dark:bg-zinc-900 dark:border-zinc-800">
                      {[
                        {type:'note',label:'Note',icon:'📝'},
                        {type:'checklist',label:'To-do List',icon:'✓'},
                        {type:'image',label:'Image',icon:'🖼️'},
                        {type:'link',label:'Link',icon:'🔗'},
                        {type:'character',label:'Character',icon:'👤'},
                        {type:'scene',label:'Scene',icon:'🎬'},
                        {type:'quote',label:'Quote',icon:'💬'},
                      ].map(item => (
                        <button
                          key={item.type}
                          onClick={() => { setShowAddMenu(false); setCardDraft({...cardDraft, type:item.type}); setIsCreateCardOpen(true); }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
                        >
                          <span className="text-base">{item.icon}</span>
                          <span className="font-medium">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                  <button
                    onClick={() => setIsTemplateOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold"
                    style={{ borderColor }}
                  >
                    <Library className="h-4 w-4" />
                    Templates
                  </button>
                  <button
                    onClick={clearBoard}
                    className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold text-red-600"
                    style={{ borderColor }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear
                  </button>
                  <UserMenu
                    user={user}
                    onLogout={handleLogout}
                    onOpenAccount={() => setIsAccountOpen(true)}
                    onOpenSettings={() => setIsAccountOpen(true)}
                  />
                  <button
                    onClick={() => setDark((v) => !v)}
                    className="rounded-xl border p-2"
                    style={{ borderColor }}
                    title={dark ? "Light mode" : "Dark mode"}
                  >
                    {dark ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <BoardTabs
                boards={selectedProject?.boards || []}
                selectedBoard={selectedBoard}
                selectedBoardId={selectedBoardId}
                setSelectedBoardId={setSelectedBoardId}
                addBoard={addBoard}
                onRenameBoard={(id, name) =>
                  setRenameBoardModal({ isOpen: true, id, name })
                }
                closeBoard={closeBoard}
                goBackFromSubBoard={goBackFromSubBoard}
                showDashboard={showDashboard}
                setShowDashboard={setShowDashboard}
                selectedProject={selectedProject}
                dark={dark}
              />

              <BoardCanvas
                selectedProject={selectedProject}
                selectedBoard={selectedBoard}
                dark={dark}
                filteredCards={selectedBoard?.cards || []}
                bringCardToFront={bringCardToFront}
                updateCard={updateCard}
                openEditCardModal={openEditCardModal}
                toggleLockCard={toggleLockCard}
                duplicateCard={duplicateCard}
                deleteCard={deleteCard}
                getCardType={getCardType}
                goToBoard={goToBoard}
                openSubBoardForCard={openSubBoardForCard}
                goBackFromSubBoard={goBackFromSubBoard}
              />
            </>
          )}
        </main>

        {/* ══════════════════════════════════════════════
            Modals
            ══════════════════════════════════════════════ */}

        <CreateCardModal
          isOpen={isCreateCardOpen}
          onClose={() => setIsCreateCardOpen(false)}
          cardDraft={cardDraft}
          setCardDraft={setCardDraft}
          onCreate={createCardFromDraft}
          selectedProject={selectedProject}
        />

        <EditCardModal
          isOpen={!!editingCard}
          onClose={() => setEditingCard(null)}
          card={editingCard}
          onSave={(updated) => {
            if (!updated?.id) return;
            updateCard(updated.id, updated);
            setEditingCard(null);
          }}
          selectedProject={selectedProject}
        />

        <CreateProjectModal
          isOpen={isCreateProjectOpen}
          onClose={() => setIsCreateProjectOpen(false)}
          folders={folders}
          onCreate={handleCreateProject}
        />

        <CreateFolderModal
          isOpen={isCreateFolderOpen}
          onClose={() => setIsCreateFolderOpen(false)}
          onCreate={handleCreateFolder}
        />

        <EditProjectModal
          isOpen={!!editProject}
          onClose={() => setEditProject(null)}
          project={editProject}
          onSave={handleEditProjectSave}
          onDelete={deleteProject}
        />

        <EditFolderModal
          isOpen={!!editFolder}
          onClose={() => setEditFolder(null)}
          folder={editFolder}
          onSave={handleEditFolderSave}
          onDelete={deleteFolder}
        />

        <RenameModal
          isOpen={renameBoardModal.isOpen}
          onClose={() =>
            setRenameBoardModal({ isOpen: false, id: null, name: "" })
          }
          initialName={renameBoardModal.name}
          title="Rename Board"
          onRename={(newName) => {
            updateProject((project) => ({
              ...project,
              boards: (project.boards || []).map((b) =>
                b.id === renameBoardModal.id
                  ? {
                      ...b,
                      name: newName,
                      title: newName,
                      updatedAt: new Date().toISOString(),
                    }
                  : b
              ),
            }));
            setRenameBoardModal({ isOpen: false, id: null, name: "" });
          }}
        />

        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() =>
            setConfirmDialog((prev) => ({
              ...prev,
              isOpen: false,
              onConfirm: null,
            }))
          }
          onConfirm={confirmDialog.onConfirm || (() => {})}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText={confirmDialog.confirmText}
          danger={confirmDialog.danger}
        />

        <ConfirmDialog
          isOpen={templateConfirm.isOpen}
          onClose={() =>
            setTemplateConfirm({ isOpen: false, template: null })
          }
          onConfirm={() =>
            templateConfirm.template &&
            doApplyTemplate(templateConfirm.template, true)
          }
          title="Replace board content?"
          message={`Apply "${
            templateConfirm.template?.name
          }" and replace all ${
            selectedBoard?.cards?.length || 0
          } cards?`}
          confirmText="Replace"
          danger={true}
        />

        <TemplateLibraryModal
          isOpen={isTemplateOpen}
          onClose={() => setIsTemplateOpen(false)}
          templates={templates}
          onApply={applyTemplate}
          onSaveCurrent={() => {
            setIsTemplateOpen(false);
            setTimeout(() => setTemplateNameModal(true), 100);
          }}
          onDelete={deleteTemplate}
          onRename={(id, name) =>
            setTemplates((prev) =>
              prev.map((t) =>
                t.id === id ? { ...t, name, custom: true } : t
              )
            )
          }
        />

        <AccountSettingsModal
          isOpen={isAccountOpen}
          onClose={() => setIsAccountOpen(false)}
          user={user}
          onSave={(updated) => setUser(updated)}
          onDelete={() => {
            setUser(null);
            setFolders([]);
            setIsAccountOpen(false);
          }}
        />

        {templateNameModal && (
          <RenameModal
            isOpen={templateNameModal}
            onClose={() => setTemplateNameModal(false)}
            initialName={`${selectedBoard?.name || "Board"} Template`}
            title="Save Template"
            onRename={(name) => saveCurrentAsTemplate(name)}
          />
        )}
      </div>
    </div>
  );
}
