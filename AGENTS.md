# AGENTS.md

## Tech Stack
- **Tauri 2** (Rust backend + WebView frontend)
- **React 19** + **TypeScript** + **Vite 8**
- **Tailwind CSS 4** (via `@tailwindcss/vite`)
- **XState 5** (state machine)
- **@dnd-kit** (drag-and-drop for reordering)
- **Drizzle ORM** (SQL migrations) + **tauri-plugin-sql** (SQLite access from JS)
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

## Mandatory Code Commenting (Self-Update Rule)
> [!IMPORTANT]
> When creating, modifying, or refactoring ANY source files, you MUST add and update concise technical comments.

### Documentation Rules:
1. **Tauri Bindings (Critical):**
   - In frontend (React), before each `invoke('command_name')` call, write a comment pointing to the Rust file with the handler (e.g., `// Invokes Rust command 'greet' in src-tauri/src/commands.rs`).
   - In Rust, before functions with `#[tauri::command]` macro, add a comment indicating which React components request this command.
2. **Typing:** If you change a `struct` in Rust that duplicates as `interface` in TypeScript (or vice versa), you MUST update both data structures and mark them with cross-references.
3. **Business Logic:** Briefly document the purpose of functions, complex math/algorithm chains, and effects (`useEffect`).
4. **No Junk:** Never comment obvious code (imports, simple HTML tags, primitive variables). Comments should be as short as possible to save context tokens.

## Architecture
```
src/
├── main.tsx              # React entry point
├── App.tsx               # Root app component
├── mobile/               # Mobile-specific UI
│   ├── MobileApp.tsx
│   ├── MobileLayout.tsx
│   ├── tabs/             # DayTab, WeekTab, ProjectsTab, OverviewTab
│   ├── components/       # Modal, Button, EditableText, SectionCard, etc.
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
    └── misc/             # date, constants, mappers (Task<->Todo)
```

## Data Flow (Mandatory Pattern)

> [!IMPORTANT]
> **Service → XState → Component** — The only correct data flow.

### Rules:
1. **Components** — only UI and event dispatching to XState. Do NOT call services directly.
2. **XState** — single source of truth. Stores data in `context`. Calls services through `actors` and `actions`.
3. **Services** — data access only (CRUD). No business logic.

### XState Context (current):
```typescript
type CombinedContext = {
    todos: Todo[]           // Tasks
    projects: Project[]     // Projects
    projectSections: Map<string, SectionWithStats[]>  // Project sections with stats
    tags: Map<string, Tag>  // Tags
}
```

### XState Events (key):
```
Todo events:    ADD, TOGGLE, DELETE, DELETE_ALL_COMPLETED, REORDER, MOVE_TO_DAY, TASKS_LOADED
Project events: LOAD_PROJECTS, ADD_PROJECT, UPDATE_PROJECT, LOAD_PROJECT_SECTIONS, PROJECT_SECTIONS_LOADED, ADD_SECTION, ADD_TASK_TO_SECTION, TOGGLE_SECTION_TASK
Tag events:     LOAD_TAGS
```

### Example of correct data update:
```typescript
// Component dispatches event
send({ type: 'UPDATE_PROJECT', project: updatedProject })

// XState action calls service and updates context
updateProject: assign({
    projects: ({ context, event }) => {
        projectService.update(event.project.id, event.project)  // Service
        return context.projects.map(p => p.id === event.project.id ? event.project : p)  // State
    }
})

// Component gets updated data from snapshot.context
const { projects } = snapshot.context
```

## Key Files

- `src-tauri/` - Rust/Tauri backend (lib name: `todo_app_lib` with `_lib` suffix for Windows compatibility)
- `src/shared/machines/todoMachine.ts` - XState machine (all events and actions)
- `src/shared/misc/mappers.ts` - Mapping functions
- `src/shared/services/db.ts` - Drizzle ORM instance with SQLite
- `src/shared/services/schema.ts` - Database schema (tasks, projects, tags, sections tables)
- `src/shared/services/*.ts` - Services (taskService, projectService, sectionService, tagService)
- `src/shared/hooks/useStore.ts` - Persistence hook using `LazyStore` from `@tauri-apps/plugin-store`
- `src/shared/machines/MachineContext.tsx` - XState hook for accessing state and send

## Quirks
- Tailwind CSS 4 uses `@tailwindcss/vite` plugin, not the classic PostCSS setup
- `vite.config.ts` ignores `src-tauri/**` from file watching
- `npm run dev` starts only the Vite server; use `npm run tauri dev` for the full app
- No test framework configured
- SQLite database managed via Drizzle ORM (not JSON files anymore)

## Database (tauri-plugin-sql)

### Important: Async Methods
Methods `db.execute()` and `db.select()` in `db.ts` **are async** (return Promise). All services **must** use `await`:
```typescript
// CORRECT
await db.execute('INSERT INTO tasks ...')
const rows = await db.select('SELECT * FROM tasks')

// WRONG (Sync wrapper returns Promise, not actual result)
db.execute('INSERT INTO tasks ...')  // Promise<void>, data not saved!
```

### Database Initialization (Migration Runner)
On mobile devices the DB is created from scratch. `MobileApp.tsx` calls `runMigrations()` at startup:
```typescript
// MobileApp.tsx
useEffect(() => {
    const initDb = async () => {
        const db = await getDb()
        await runMigrations(db)  // Creates tables from drizzle/*.sql
        setDbReady(true)
    }
    initDb()
}, [])
```

SQL migration files are imported via Vite `import.meta.glob`:
```typescript
const migrationFiles = import.meta.glob<string>('../../../drizzle/*.sql', { query: '?raw', import: 'default', eager: true })
```

### Database Path
Frontend gets path via Rust command `get_app_db_path` (resolves `app_data_dir`):
```typescript
const dbPath: string = await invoke('get_app_db_path')
const db = await Database.load(`sqlite:${dbPath}`)
```
