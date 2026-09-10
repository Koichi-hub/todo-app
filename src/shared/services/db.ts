import { Database } from '@tauri-apps/plugin-sql';
import { drizzle } from 'drizzle-orm/tauri-api';
import * as schema from './schema';

let db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
    if (db) return db;

    const sqlite = await Database.load('sqlite:todo.db');
    db = drizzle(sqlite, { schema });

    return db;
}

export { schema };
