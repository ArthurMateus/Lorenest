// =============================================
// LORENEST — Default Template Library
// =============================================

const uid = () => "tpl_" + Math.random().toString(36).slice(2, 10);

export const defaultTemplates = [
  // ─── 1. Character Sheet (your existing, enhanced) ───
  {
    id: "tpl-character-sheet",
    name: "Character Sheet",
    icon: "👤",
    description: "Deep dive into a character",
    category: "Characters",
    color: "#8b5cf6",
    custom: false,
    cards: [
      { type: "character", title: "Name / Age", content: "Full Name: \nAge: \nPronouns: \nRole: ", tags: ["basics"], color: "#ede9fe", x: 40, y: 40, w: 280, h: 160 },
      { type: "note", title: "Appearance", content: "• Hair:\n• Eyes:\n• Build:\n• Distinguishing features:", tags: ["basics"], color: "#fce7f3", x: 340, y: 40, w: 280, h: 180 },
      { type: "note", title: "Personality", content: "• Core trait:\n• Quirks:\n• How they speak:\n• MBTI / Enneagram:", tags: ["psych"], color: "#dcfce7", x: 640, y: 40, w: 280, h: 220 },
      { type: "note", title: "Backstory", content: "Where did they come from? What shaped them? What event changed everything?", tags: ["backstory"], color: "#e0e7ff", x: 40, y: 220, w: 580, h: 240 },
      { type: "note", title: "Goals & Motivation", content: "External goal: What they want\nInternal goal: What they need\nMotivation: Why now?", tags: ["motivation"], color: "#fef3c7", x: 640, y: 280, w: 280, h: 180 },
      { type: "note", title: "Fears & Flaws", content: "Greatest fear:\nFatal flaw:\nSecret:\nVulnerability:", tags: ["psych"], color: "#fee2e2", x: 40, y: 480, w: 280, h: 180 },
      { type: "note", title: "Relationships", content: "• Best friend:\n• Mentor:\n• Rival:\n• Love interest:\n• Family:", tags: ["relationships"], color: "#f0eef9", x: 340, y: 480, w: 280, h: 180 },
      { type: "image", title: "Reference Image", content: "", tags: ["visual"], color: "#ffffff", x: 640, y: 480, w: 280, h: 220 },
    ],
  },

  // ─── 2. World Bible (your existing, enhanced) ───
  {
    id: "tpl-world",
    name: "World Bible",
    icon: "🌍",
    description: "Build your universe",
    category: "Worldbuilding",
    color: "#0ea5e9",
    custom: false,
    cards: [
      { type: "note", title: "World Name & Overview", content: "Name of the world/setting:\n\nTime period:\nGenre:\nCore concept:", tags: ["overview"], color: "#e0f2fe", x: 40, y: 40, w: 300, h: 180 },
      { type: "note", title: "Geography & Climate", content: "• Key locations:\n• Climate zones:\n• Natural features:\n• How geography affects culture:", tags: ["world"], color: "#ccfbf1", x: 360, y: 40, w: 300, h: 200 },
      { type: "note", title: "Culture & Society", content: "• Social structure:\n• Values & taboos:\n• Art & music:\n• Festivals & rituals:\n• Language notes:", tags: ["world"], color: "#dbeafe", x: 680, y: 40, w: 300, h: 200 },
      { type: "note", title: "History & Timeline", content: "• Origin / creation:\n• Major wars or events:\n• Recent history:\n• Current political situation:", tags: ["lore"], color: "#f3e8ff", x: 40, y: 260, w: 300, h: 220 },
      { type: "note", title: "Magic / Technology", content: "System name:\nRules:\n1. \n2. \n3. \nCost / limitations:\nWho can use it?", tags: ["system"], color: "#eef6ee", x: 360, y: 260, w: 300, h: 220 },
      { type: "note", title: "Politics & Power", content: "• Government type:\n• Key factions:\n• Conflicts:\n• Power dynamics:", tags: ["world"], color: "#fdf8ee", x: 680, y: 260, w: 300, h: 220 },
      { type: "note", title: "Key Locations", content: "Location 1:\nLocation 2:\nLocation 3:\n\nDescribe atmosphere, inhabitants, and significance.", tags: ["world"], color: "#e8ecf4", x: 40, y: 500, w: 620, h: 180 },
      { type: "note", title: "References & Inspiration", content: "• Books:\n• Films:\n• Real-world parallels:\n• Art references:", tags: ["reference"], color: "#f9eeee", x: 680, y: 500, w: 300, h: 180 },
    ],
  },

  // ─── 3. Novel Outline (your existing, enhanced) ───
  {
    id: "tpl-novel",
    name: "Novel Outline",
    icon: "📖",
    description: "Three-act structure with key beats",
    category: "Writing",
    color: "#f59e0b",
    custom: false,
    cards: [
      { type: "divider", title: "━━━ ACT 1: SETUP ━━━", content: "ACT 1", tags: ["act1"], color: "#eef2f9", x: 40, y: 20, w: 600, h: 50 },
      { type: "note", title: "Hook / Opening", content: "The first scene that grabs the reader.\n\nWhat is the protagonist's ordinary world?", tags: ["act1"], color: "#ffedd5", x: 40, y: 90, w: 280, h: 180 },
      { type: "note", title: "Inciting Incident", content: "The event that disrupts the status quo.\n\nWhat choice does the protagonist face?", tags: ["act1"], color: "#fed7aa", x: 340, y: 90, w: 280, h: 180 },
      { type: "divider", title: "━━━ ACT 2: CONFRONTATION ━━━", content: "ACT 2", tags: ["act2"], color: "#f0eef9", x: 40, y: 300, w: 920, h: 50 },
      { type: "note", title: "Rising Action", content: "• First obstacle:\n• New allies:\n• Subplot begins:\n• Protagonist's plan:", tags: ["act2"], color: "#fdf8ee", x: 40, y: 370, w: 280, h: 200 },
      { type: "note", title: "Midpoint Reversal", content: "Everything changes. New information raises the stakes.\n\nFalse victory or false defeat.", tags: ["act2"], color: "#fdba74", x: 340, y: 370, w: 280, h: 200 },
      { type: "note", title: "Crisis / Dark Night", content: "All seems lost. The protagonist must confront their deepest fear.", tags: ["act2"], color: "#f9eeee", x: 640, y: 370, w: 280, h: 200 },
      { type: "divider", title: "━━━ ACT 3: RESOLUTION ━━━", content: "ACT 3", tags: ["act3"], color: "#eef6ee", x: 40, y: 600, w: 600, h: 50 },
      { type: "note", title: "Climax", content: "The final confrontation. All subplots converge. Theme is embodied in action.", tags: ["act3"], color: "#eef6ee", x: 40, y: 670, w: 280, h: 180 },
      { type: "note", title: "Resolution", content: "New equilibrium. How has the protagonist changed? Final image.", tags: ["act3"], color: "#e8ecf4", x: 340, y: 670, w: 280, h: 180 },
    ],
  },

  // ─── 4. Research Board (your existing, enhanced) ───
  {
    id: "tpl-research",
    name: "Research Board",
    icon: "🔬",
    description: "Collect links, images, notes, and sources",
    category: "Research",
    color: "#10b981",
    custom: false,
    cards: [
      { type: "note", title: "Research Question", content: "What are you trying to find out?\n\nMain question:\nSub-questions:", tags: ["research"], color: "#d1fae5", x: 40, y: 40, w: 400, h: 160 },
      { type: "link", title: "Source 1", content: "Title:\nURL:\nKey takeaway:", tags: ["source"], color: "#ecfdf5", x: 40, y: 220, w: 280, h: 160 },
      { type: "link", title: "Source 2", content: "Title:\nURL:\nKey takeaway:", tags: ["source"], color: "#ecfdf5", x: 340, y: 220, w: 280, h: 160 },
      { type: "quote", title: "Key Quotes", content: "\"The map is not the territory.\" — Alfred Korzybski\n\n\"Not all those who wander are lost.\" — J.R.R. Tolkien", tags: ["quotes"], color: "#f0eef9", x: 640, y: 40, w: 280, h: 200 },
      { type: "note", title: "Notes & Observations", content: "• \n• \n• ", tags: ["notes"], color: "#fdf8ee", x: 640, y: 260, w: 280, h: 200 },
      { type: "note", title: "Open Questions", content: "❓ \n❓ \n❓ ", tags: ["questions"], color: "#e8ecf4", x: 40, y: 400, w: 400, h: 160 },
    ],
  },

  // ─── 5. Story Outline ───
  {
    id: "tpl-story-outline",
    name: "Story Outline",
    icon: "📝",
    description: "Map your story from beginning to end",
    category: "Writing",
    color: "#8B7CF6",
    custom: false,
    cards: [
      { type: "note", title: "Beginning / Setup", content: "Introduce the protagonist in their ordinary world.\n\n• Character's daily routine\n• Key relationships introduced\n• The world before change", tags: [], color: "#eef2f9", x: 60, y: 60, w: 300, h: 240 },
      { type: "note", title: "Inciting Incident", content: "The event that disrupts the ordinary world.\n\nWhat forces the protagonist to act?\nWhat are the stakes?", tags: [], color: "#fdf8ee", x: 390, y: 60, w: 300, h: 240 },
      { type: "note", title: "Rising Action", content: "Escalating conflicts.\n\n• First major obstacle\n• Ally introduction\n• Subplot development\n• First setback", tags: [], color: "#f0eef9", x: 60, y: 330, w: 300, h: 240 },
      { type: "note", title: "Midpoint", content: "The story shifts direction.\n\n• Revelation or betrayal\n• Protagonist commits fully\n• Point of no return", tags: [], color: "#eef6ee", x: 390, y: 330, w: 300, h: 240 },
      { type: "note", title: "Climax", content: "Highest point of tension.\n\n• Final confrontation\n• Greatest sacrifice\n• Theme embodied in action", tags: [], color: "#f9eeee", x: 60, y: 600, w: 300, h: 220 },
      { type: "note", title: "Resolution", content: "The aftermath.\n\n• New normal established\n• Emotional resolution\n• Final image mirrors opening", tags: [], color: "#e8ecf4", x: 390, y: 600, w: 300, h: 220 },
    ],
  },

  // ─── 6. Character Relationship Map ───
  {
    id: "tpl-relationship-map",
    name: "Character Relationship Map",
    icon: "🕸️",
    description: "Visual character web with connections",
    category: "Characters",
    color: "#D89A9E",
    custom: false,
    cards: [
      { type: "character", title: "Protagonist", content: "[Name]\nRole: Main character\nThe heart of the story", tags: ["main"], color: "#f0eef9", x: 360, y: 280, w: 220, h: 140 },
      { type: "character", title: "Best Friend / Ally", content: "[Name]\nRole: Support\nRelationship: Trust & loyalty", tags: ["ally"], color: "#eef6ee", x: 80, y: 120, w: 200, h: 130 },
      { type: "character", title: "Mentor", content: "[Name]\nRole: Guide\nRelationship: Teacher → student", tags: ["mentor"], color: "#fdf8ee", x: 640, y: 120, w: 200, h: 130 },
      { type: "character", title: "Antagonist", content: "[Name]\nRole: Opposition\nRelationship: Conflict & rivalry", tags: ["enemy"], color: "#f9eeee", x: 640, y: 440, w: 200, h: 130 },
      { type: "character", title: "Love Interest", content: "[Name]\nRole: Emotional catalyst\nRelationship: Romance / tension", tags: ["romance"], color: "#e8ecf4", x: 80, y: 440, w: 200, h: 130 },
      { type: "note", title: "Family", content: "• Parent/Guardian:\n• Sibling:\n• Extended family:", tags: ["family"], color: "#fdf8ee", x: 360, y: 60, w: 220, h: 130 },
      { type: "note", title: "Allies", content: "• [Name] — role\n• [Name] — role\n• [Name] — role", tags: ["ally"], color: "#eef6ee", x: 40, y: 280, w: 200, h: 130 },
      { type: "note", title: "Enemies", content: "• [Name] — threat\n• [Name] — threat\n• [Name] — threat", tags: ["enemy"], color: "#f9eeee", x: 700, y: 280, w: 200, h: 130 },
      { type: "divider", title: "── Ally  ╌╌ Rival  ⋯ Family  ═ Romance ──", content: "", tags: [], color: "#e8ecf4", x: 80, y: 610, w: 780, h: 50 },
    ],
  },

  // ─── 7. Moodboard ───
  {
    id: "tpl-moodboard",
    name: "Moodboard",
    icon: "🎨",
    description: "Visual inspiration: images, colors, textures, notes",
    category: "Moodboard",
    color: "#243B67",
    custom: false,
    cards: [
      { type: "note", title: "🎨 Moodboard Title", content: "Project: [Your Project]\nMood: atmospheric, ethereal\nSeason: autumn\nTime: golden hour", tags: [], color: "#fdf8ee", x: 60, y: 60, w: 300, h: 150 },
      { type: "image", title: "Reference 1", content: "", tags: ["visual"], color: "#ffffff", x: 60, y: 240, w: 220, h: 200 },
      { type: "image", title: "Reference 2", content: "", tags: ["visual"], color: "#ffffff", x: 300, y: 240, w: 220, h: 200 },
      { type: "image", title: "Reference 3", content: "", tags: ["visual"], color: "#ffffff", x: 540, y: 240, w: 220, h: 200 },
      { type: "note", title: "🎨 Color Palette", content: "■ #2C3E50 — Deep midnight\n■ #8B7355 — Warm leather\n■ #D4A574 — Golden parchment\n■ #A7B89A — Sage green\n■ #C9B1FF — Soft lavender", tags: [], color: "#e8ecf4", x: 400, y: 60, w: 300, h: 150 },
      { type: "note", title: "Typography", content: "Headers: Playfair Display\nBody: Source Serif Pro\nAccent: Caveat (handwriting)\n\nFeel: elegant, literary", tags: [], color: "#fdf8ee", x: 60, y: 470, w: 260, h: 160 },
      { type: "note", title: "Textures & Materials", content: "• Aged paper\n• Watercolor washes\n• Ink splatters\n• Wax seals\n• Pressed botanicals", tags: [], color: "#eef2f9", x: 340, y: 470, w: 260, h: 160 },
      { type: "link", title: "🔗 Inspiration Links", content: "• Pinterest board: [link]\n• Behance: [link]\n• Unsplash: [link]", tags: [], color: "#f0eef9", x: 620, y: 470, w: 260, h: 160 },
    ],
  },

  // ─── 8. Chapter Draft Board ───
  {
    id: "tpl-chapter-draft",
    name: "Chapter Draft Board",
    icon: "📑",
    description: "Organize a chapter: summary, scenes, drafting notes, revision",
    category: "Planning",
    color: "#243B67",
    custom: false,
    cards: [
      { type: "note", title: "Chapter Summary", content: "Chapter [#]: [Title]\n\nSummary:\n\nWord count target:\nPOV:", tags: [], color: "#eef2f9", x: 60, y: 60, w: 340, h: 220 },
      { type: "note", title: "Scene Breakdown", content: "Scene 1:\nScene 2:\nScene 3:\nScene 4:", tags: [], color: "#fdf8ee", x: 420, y: 60, w: 340, h: 220 },
      { type: "todo", title: "Drafting Checklist", content: "[ ] Write Scene 1\n[ ] Write Scene 2\n[ ] Write Scene 3\n[ ] First pass line edit\n[ ] Check continuity", tags: [], color: "#eef6ee", x: 60, y: 310, w: 340, h: 220 },
      { type: "note", title: "Draft Notes", content: "• Tone to aim for:\n• Key emotional beat:\n• Sensory details to include:\n• Foreshadowing:", tags: [], color: "#f0eef9", x: 420, y: 310, w: 340, h: 220 },
      { type: "note", title: "Revision Notes", content: "• Pacing check:\n• Character voice consistent?\n• Sensory details:\n• Foreshadowing planted?", tags: [], color: "#f9eeee", x: 60, y: 560, w: 340, h: 180 },
      { type: "note", title: "📊 Status", content: "Draft: First draft\nStatus: In Progress ⏳\nWord Count: 0 / 3,500\nConfidence: 🟡 Needs work", tags: [], color: "#e8ecf4", x: 420, y: 560, w: 340, h: 180 },
    ],
  },

  // ─── 9. Kanban Writing Board ───
  {
    id: "tpl-kanban-writing",
    name: "Kanban Writing Board",
    icon: "📋",
    description: "Track writing progress: Ideas → Planned → Drafting → Done",
    category: "Planning",
    color: "#8B7CF6",
    custom: false,
    cards: [
      { type: "note", title: "Scene idea: locked door", content: "A door that only opens when the key is drawn on a map.", tags: ["backlog"], color: "#f0eef9", x: 60, y: 60, w: 260, h: 130 },
      { type: "note", title: "Scene idea: festival", content: "A celebration where inhabitants create art from living ink.", tags: ["backlog"], color: "#f0eef9", x: 60, y: 210, w: 260, h: 130 },
      { type: "note", title: "Chapter 1: Ordinary World", content: "Protagonist's daily life. Establish routine and loneliness.", tags: ["backlog"], color: "#fdf8ee", x: 340, y: 60, w: 260, h: 130 },
      { type: "note", title: "Chapter 2: The Discovery", content: "Finding the hidden workshop and the first living map.", tags: ["doing"], color: "#eef2f9", x: 620, y: 60, w: 260, h: 130 },
      { type: "note", title: "Chapter 3: New World", content: "First entry into the parallel world. Wonder and danger.", tags: ["doing"], color: "#eef2f9", x: 620, y: 210, w: 260, h: 130 },
      { type: "note", title: "Prologue draft", content: "Grandmother's perspective — drawing the first map decades ago.", tags: ["done"], color: "#eef6ee", x: 900, y: 60, w: 260, h: 130 },
    ],
  },

  // ─── 10. Novel Plan ───
  {
    id: "tpl-novel-plan",
    name: "Novel Plan",
    icon: "📚",
    description: "Plan your novel: premise, themes, audience, voice, references",
    category: "Writing",
    color: "#243B67",
    custom: false,
    cards: [
      { type: "note", title: "Premise", content: "A young [protagonist] discovers [inciting discovery] that reveals [hidden world/truth]. They must [quest/goal] before [stakes/deadline].", tags: [], color: "#eef2f9", x: 60, y: 60, w: 340, h: 200 },
      { type: "note", title: "Themes", content: "• Theme 1:\n• Theme 2:\n• Theme 3:\n• Central question:", tags: [], color: "#f0eef9", x: 420, y: 60, w: 340, h: 200 },
      { type: "note", title: "Genre & Comps", content: "Genre:\nTone:\nComparable titles:\n\n[Title 1] meets [Title 2]", tags: [], color: "#fdf8ee", x: 60, y: 290, w: 340, h: 180 },
      { type: "note", title: "Target Audience", content: "Age range:\nReaders who enjoy:\n• \n• \n• ", tags: [], color: "#eef6ee", x: 420, y: 290, w: 340, h: 180 },
      { type: "note", title: "Voice & Style", content: "POV:\nTense:\nNarrative style:\nChapter structure:", tags: [], color: "#f9eeee", x: 60, y: 500, w: 340, h: 180 },
      { type: "note", title: "References & Inspiration", content: "• Books:\n• Films/Shows:\n• Art/Music:\n• Real-world inspiration:", tags: [], color: "#e8ecf4", x: 420, y: 500, w: 340, h: 180 },
    ],
  },
];