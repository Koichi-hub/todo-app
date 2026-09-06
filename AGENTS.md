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
- `src/` - React frontend
- `src-tauri/` - Rust/Tauri backend (lib name: `todo_app_lib` with `_lib` suffix for Windows compatibility)
- `src/machines/todoMachine.ts` - XState machine (ADD, TOGGLE, DELETE, REORDER events)
- `src/hooks/useStore.ts` - Persistence hook wrapping `LazyStore` from `@tauri-apps/plugin-store`
- `src/components/SortableTodo.tsx` - Draggable todo item

## Quirks
- Tailwind CSS 4 uses `@tailwindcss/vite` plugin, not the classic PostCSS setup
- `vite.config.ts` ignores `src-tauri/**` from file watching
- `npm run dev` starts only the Vite server; use `npm run tauri dev` for the full app
- No test framework configured
