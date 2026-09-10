# AGENTS.md

## Tech Stack
- **Tauri 2** (Rust backend + WebView frontend)
- **React 19** + **TypeScript** + **Vite 8**
- **Tailwind CSS 4** (via `@tailwindcss/vite`)
- **XState 5** (state machine)
- **@dnd-kit** (drag-and-drop for reordering)
- **@tauri-apps/plugin-store** (JSON persistence to `todos.json`)

## Key Commands
```bash
npm run dev          # Vite dev server only (port 1420)
npm run build        # TypeScript check + Vite build → dist/
npm run tauri dev    # Full Tauri app (frontend + Rust backend)
npm run tauri build  # Production Tauri build
```

## Architecture
```
src/
├── main.tsx              # React entry point
├── App.tsx               # Root app component
├── mobile/               # Mobile-specific UI
│   ├── MobileApp.tsx
│   ├── MobileLayout.tsx
│   ├── tabs/             # DayTab, WeekTab, ProjectsTab, OverviewTab
│   └── components/       # Modal, Button
├── desktop/              # Desktop-specific UI
│   ├── DesktopApp.tsx
│   └── components/       # TodoItem
└── shared/               # Shared code
    ├── types/            # Todo, Modal, MobileLayout, Button types
    ├── machines/         # XState todoMachine
    ├── hooks/            # useStore (persistence)
    └── components/       # TodoItem
```

- `src-tauri/` - Rust/Tauri backend (lib name: `todo_app_lib` with `_lib` suffix for Windows compatibility)
- `src/shared/machines/todoMachine.ts` - XState machine with events: ADD, TOGGLE, DELETE, DELETE_ALL_COMPLETED, REORDER, MOVE_TO_DAY, TASKS_LOADED
- `src/shared/hooks/useStore.ts` - Persistence hook wrapping `LazyStore` from `@tauri-apps/plugin-store`

## Quirks
- Tailwind CSS 4 uses `@tailwindcss/vite` plugin, not the classic PostCSS setup
- `vite.config.ts` ignores `src-tauri/**` from file watching
- `npm run dev` starts only the Vite server; use `npm run tauri dev` for the full app
- No test framework configured
