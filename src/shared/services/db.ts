// Мост к tauri-plugin-sql: прямой доступ к SQLite из JS (без invoke).
// Инициализируется один раз, затем используется сервисами (taskService, projectService и др.).
// Таблицы создаются через Drizzle migrations (src/shared/services/schema.ts).
import Database from '@tauri-apps/plugin-sql';
import * as schema from './schema';

interface DbInterface {
    execute(sql: string, params?: any[]): { rowsAffected: number; lastInsertId?: number };
    select<T>(sql: string, params?: any[]): T[];
}

let dbInstance: DbInterface | null = null;

async function createTauriDb(): Promise<DbInterface> {
    const db = await Database.load('sqlite:todo.db');
    return {
        execute(sql: string, params: any[] = []) {
            const result = (db as any).execute(sql, params);
            return { rowsAffected: result.rowsAffected, lastInsertId: result.lastInsertId };
        },
        select<T>(sql: string, params: any[] = []): T[] {
            const result = (db as any).select(sql, params);
            return result as T[];
        }
    };
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