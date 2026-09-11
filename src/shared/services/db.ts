// Мост к tauri-plugin-sql: прямой доступ к SQLite из JS (без invoke).
// Инициализируется один раз, затем используется сервисами (taskService, projectService и др.).
// Таблицы создаются через Drizzle migrations (src/shared/services/schema.ts).
import Database from '@tauri-apps/plugin-sql';
import { invoke } from '@tauri-apps/api/core';
import * as schema from './schema';

// Импорт SQL-миграций Drizzle через Vite (glob).
// На ПК миграции уже применены, но на мобильных устройствах БД создаётся с нуля.
const migrationFiles = import.meta.glob<string>('../../../drizzle/*.sql', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

interface DbInterface {
    execute(sql: string, params?: any[]): Promise<{ rowsAffected: number; lastInsertId?: number }>;
    select<T>(sql: string, params?: any[]): Promise<T[]>;
}

let dbInstance: DbInterface | null = null;

async function createTauriDb(): Promise<DbInterface> {
    // Получаем путь к app_data_dir от Rust (кроссплатформенно).
    // На Android/iOS это внутренняя директория приложения.
    const dbPath: string = await invoke('get_app_db_path');
    const db = await Database.load(`sqlite:${dbPath}`);
    return {
        async execute(sql: string, params: any[] = []) {
            const result = await (db as any).execute(sql, params);
            return { rowsAffected: result.rowsAffected, lastInsertId: result.lastInsertId };
        },
        async select<T>(sql: string, params: any[] = []): Promise<T[]> {
            const result = await (db as any).select(sql, params);
            return result as T[];
        }
    };
}

// Клиентский runner миграций: выполняет SQL из файлов миграций Drizzle.
// Вызывать один раз при старте приложения (до первого SELECT).
export async function runMigrations(db: DbInterface): Promise<void> {
    const sortedMigrations = Object.entries(migrationFiles).sort(([a], [b]) => a.localeCompare(b));

    for (const [, sql] of sortedMigrations) {
        const statements = sql
            .split('--> statement-breakpoint')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        for (const statement of statements) {
            try {
                await db.execute(statement);
            } catch (err) {
                console.error('[Migration] Failed to execute:', statement.slice(0, 100), err);
            }
        }
    }
}

export async function getDb() {
    if (!dbInstance) {
        dbInstance = await createTauriDb();
    }
    return dbInstance;
}

// Экспорт типов Drizzle ORM для использования в сервисах (taskService, projectService и др.).
// ВАЖНО: Типы Task, Project, Tag, Section — это projections таблиц БД.
// Они ДУБЛИРУЮТСЯ во фронтенде как интерфейсы в Todo.ts.
// При изменении структуры Task в БД необходимо синхронизировать с Todo.ts!
export { schema };