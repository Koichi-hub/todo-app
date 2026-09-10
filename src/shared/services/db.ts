import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { join } from 'path';
import { appDataDir } from '@tauri-apps/api/path';
import * as schema from './schema';

let db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
    if (db) return db;

    const appData = await appDataDir();
    const dbPath = join(appData, 'todo.db');

    const sqlite = new Database(dbPath);
    db = drizzle(sqlite, { schema });

    return db;
}

export { schema };
