# AGENTS.md

## Tech Stack
- **Tauri 2** (Rust backend + WebView frontend)
- **React 19** + **TypeScript** + **Vite 8**
- **Tailwind CSS 4** (via `@tailwindcss/vite`)
- **XState 5** (state machine)
- **@dnd-kit** (drag-and-drop for reordering)
- **Drizzle ORM** + **better-sqlite3** (SQL persistence via `tauri-plugin-sql`)
- **@tauri-apps/plugin-store** (JSON config storage)
- **@tauri-apps/plugin-os** (OS info)

## Key Commands
```bash
npm run dev          # Vite dev server only (port 1420)
npm run build        # TypeScript check + Vite build → dist/
npm run tauri dev    # Full Tauri app (frontend + Rust backend)
npm run tauri build  # Production Tauri build
npm run db:generate  # Drizzle: generate migrations
npm run db:migrate   # Drizzle: apply migrations
npm run db:push      # Drizzle: push schema to DB
npm run db:studio    # Drizzle: open DB studio
```

## Обязательное комментирование кода (Правило Авто-актуализации)
> [!IMPORTANT]
> При создании, изменении или рефакторинге ЛЮБЫХ файлов исходного кода, ты ОБЯЗАН добавлять и актуализировать лаконичные технические комментарии.

### Правила документирования:
1. **Связи Tauri (Критично):** 
   - Во фронтенде (React) перед каждым вызовом `invoke('command_name')` обязательно пиши комментарий с указанием Rust-файла, где лежит обработчик (например, `// Вызывает Rust-команду 'greet' в src-tauri/src/commands.rs`).
   - В Rust перед функциями с макросом `#[tauri::command]` добавляй комментарий, указывающий, какие компоненты React запрашивают эту команду.
2. **Типизация:** Если ты меняешь `struct` в Rust, которая дублируется как `interface` в TypeScript (или наоборот), ты обязан обновить обе структуры данных и пометить их перекрестными комментариями.
3. **Бизнес-логика:** Кратко документируй цель функций, сложные математические/алгоритмические цепочки и эффекты (`useEffect`).
4. **Запрет на мусор:** Никогда не комментируй очевидный код (импорты, простые HTML-теги, примитивные переменные). Комментарии должны быть максимально короткими для экономии токенов контекста.

## Architecture
```
src/
├── main.tsx              # React entry point
├── App.tsx               # Root app component
├── mobile/               # Mobile-specific UI
│   ├── MobileApp.tsx
│   ├── MobileLayout.tsx
│   ├── tabs/             # DayTab, WeekTab, ProjectsTab, OverviewTab
│   ├── components/       # Modal, Button
│   ├── types/            # Modal, MobileLayout, Button types
│   └── misc/             # tabs.tsx
├── desktop/              # Desktop-specific UI
│   ├── DesktopApp.tsx
│   └── components/       # TodoItem
└── shared/               # Shared code
    ├── types/            # Todo, Modal, MobileLayout, Button types
    ├── machines/         # XState todoMachine
    ├── hooks/            # useStore (persistence)
    ├── services/         # db, schema, taskService, projectService, tagService, sectionService
    ├── components/       # TodoItem
    └── misc/             # date, constants
```

- `src-tauri/` - Rust/Tauri backend (lib name: `todo_app_lib` with `_lib` suffix for Windows compatibility)
- `src/shared/machines/todoMachine.ts` - XState machine with events: ADD, TOGGLE, DELETE, DELETE_ALL_COMPLETED, REORDER, MOVE_TO_DAY, TASKS_LOADED
- `src/shared/services/db.ts` - Drizzle ORM instance with SQLite
- `src/shared/services/schema.ts` - Database schema (tasks, projects, tags, sections tables)
- `src/shared/hooks/useStore.ts` - Persistence hook using `LazyStore` from `@tauri-apps/plugin-store`

## Quirks
- Tailwind CSS 4 uses `@tailwindcss/vite` plugin, not the classic PostCSS setup
- `vite.config.ts` ignores `src-tauri/**` from file watching
- `npm run dev` starts only the Vite server; use `npm run tauri dev` for the full app
- No test framework configured
- SQLite database managed via Drizzle ORM (not JSON files anymore)
