import { getDb } from './db';
import type { Section, NewSection } from './schema';

function mapRowToSection(row: any): Section {
    return {
        id: row.id,
        name: row.name,
        description: row.description,
        creationDate: row.creation_date ? new Date(row.creation_date) : new Date(),
        projectId: row.project_id || null,
        tagId: row.tag_id || null,
    };
}

export const sectionService = {
    async getAll(): Promise<Section[]> {
        const db = await getDb();
        const rows = db.select<any[]>('SELECT * FROM sections');
        return rows.map(mapRowToSection);
    },

    async getById(id: string): Promise<Section | undefined> {
        const db = await getDb();
        const rows = db.select<any[]>('SELECT * FROM sections WHERE id = ?', [id]);
        return rows.length > 0 ? mapRowToSection(rows[0]) : undefined;
    },

    async getByProjectId(projectId: string): Promise<Section[]> {
        const db = await getDb();
        const rows = db.select<any[]>('SELECT * FROM sections WHERE project_id = ?', [projectId]);
        return rows.map(mapRowToSection);
    },

    async getByTagId(tagId: string): Promise<Section[]> {
        const db = await getDb();
        const rows = db.select<any[]>('SELECT * FROM sections WHERE tag_id = ?', [tagId]);
        return rows.map(mapRowToSection);
    },

    async create(data: NewSection): Promise<Section> {
        const db = await getDb();
        const id = data.id || crypto.randomUUID();
        db.execute(
            `INSERT INTO sections (id, name, description, creation_date, project_id, tag_id) VALUES (?, ?, ?, ?, ?, ?)`,
            [id, data.name, data.description, data.creationDate.getTime(), data.projectId || null, data.tagId || null]
        );
        const result = await this.getById(id);
        if (!result) throw new Error('Failed to create section');
        return result;
    },

    async update(id: string, data: Partial<NewSection>): Promise<Section | undefined> {
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
        if (data.projectId !== undefined) {
            updates.push('project_id = ?');
            values.push(data.projectId);
        }
        if (data.tagId !== undefined) {
            updates.push('tag_id = ?');
            values.push(data.tagId);
        }

        if (updates.length > 0) {
            values.push(id);
            db.execute(`UPDATE sections SET ${updates.join(', ')} WHERE id = ?`, values);
        }

        return this.getById(id);
    },

    async delete(id: string): Promise<void> {
        const db = await getDb();
        db.execute('DELETE FROM sections WHERE id = ?', [id]);
    },
};