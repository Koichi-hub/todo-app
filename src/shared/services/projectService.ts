import { getDb } from './db';
import type { Project, NewProject } from './schema';

function mapRowToProject(row: any): Project {
    return {
        id: row.id,
        name: row.name,
        description: row.description,
        creationDate: row.creation_date ? new Date(row.creation_date) : new Date(),
        tagId: row.tag_id || null,
    };
}

export const projectService = {
    async getAll(): Promise<Project[]> {
        const db = await getDb();
        const rows = db.select<any[]>('SELECT * FROM projects');
        return rows.map(mapRowToProject);
    },

    async getById(id: string): Promise<Project | undefined> {
        const db = await getDb();
        const rows = db.select<any[]>('SELECT * FROM projects WHERE id = ?', [id]);
        return rows.length > 0 ? mapRowToProject(rows[0]) : undefined;
    },

    async getByTagId(tagId: string): Promise<Project[]> {
        const db = await getDb();
        const rows = db.select<any[]>('SELECT * FROM projects WHERE tag_id = ?', [tagId]);
        return rows.map(mapRowToProject);
    },

    async create(data: NewProject): Promise<Project> {
        const db = await getDb();
        const id = data.id || crypto.randomUUID();
        db.execute(
            `INSERT INTO projects (id, name, description, creation_date, tag_id) VALUES (?, ?, ?, ?, ?)`,
            [id, data.name, data.description, data.creationDate.getTime(), data.tagId || null]
        );
        const result = await this.getById(id);
        if (!result) throw new Error('Failed to create project');
        return result;
    },

    async update(id: string, data: Partial<NewProject>): Promise<Project | undefined> {
        const db = await getDb();
        const updates: string[] = [];
        const values: any[] = [];

        if (data.name !== undefined) {
            updates.push('name = ?');
            values.push(data.name);
        }
        if (data.description !== undefined) {
            updates.push('description = ?');
            values.push(data.description);
        }
        if (data.tagId !== undefined) {
            updates.push('tag_id = ?');
            values.push(data.tagId);
        }

        if (updates.length > 0) {
            values.push(id);
            db.execute(`UPDATE projects SET ${updates.join(', ')} WHERE id = ?`, values);
        }

        return this.getById(id);
    },

    async delete(id: string): Promise<void> {
        const db = await getDb();
        db.execute('DELETE FROM projects WHERE id = ?', [id]);
    },
};