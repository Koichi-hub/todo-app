import { getDb } from './db';
import type { Tag, NewTag } from './schema';

function mapRowToTag(row: any): Tag {
    return {
        id: row.id,
        name: row.name,
    };
}

export const tagService = {
    async getAll(): Promise<Tag[]> {
        const db = await getDb();
        const rows = db.select<any[]>('SELECT * FROM tags');
        return rows.map(mapRowToTag);
    },

    async getById(id: string): Promise<Tag | undefined> {
        const db = await getDb();
        const rows = db.select<any[]>('SELECT * FROM tags WHERE id = ?', [id]);
        return rows.length > 0 ? mapRowToTag(rows[0]) : undefined;
    },

    async create(data: NewTag): Promise<Tag> {
        const db = await getDb();
        const id = data.id || crypto.randomUUID();
        db.execute('INSERT INTO tags (id, name) VALUES (?, ?)', [id, data.name]);
        const result = await this.getById(id);
        if (!result) throw new Error('Failed to create tag');
        return result;
    },

    async update(id: string, data: Partial<NewTag>): Promise<Tag | undefined> {
        const db = await getDb();
        const updates: string[] = [];
        const values: any[] = [];

        if (data.name !== undefined) {
            updates.push('name = ?');
            values.push(data.name);
        }

        if (updates.length > 0) {
            values.push(id);
            db.execute(`UPDATE tags SET ${updates.join(', ')} WHERE id = ?`, values);
        }

        return this.getById(id);
    },

    async delete(id: string): Promise<void> {
        const db = await getDb();
        db.execute('DELETE FROM tags WHERE id = ?', [id]);
    },
};