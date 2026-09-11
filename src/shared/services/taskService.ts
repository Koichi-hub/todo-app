import { getDb } from './db';
import type { Task, NewTask } from './schema';

function mapRowToTask(row: any): Task {
    return {
        id: row.id,
        name: row.name,
        description: row.description,
        isCompleted: Boolean(row.is_completed),
        creationDate: row.creation_date ? new Date(row.creation_date) : new Date(),
        placementDate: row.placement_date ? new Date(row.placement_date) : new Date(),
        recordedTimeInSecs: row.recorded_time_in_secs || 0,
        sectionId: row.section_id || null,
    };
}

export const taskService = {
    async getAll(): Promise<Task[]> {
        const db = await getDb();
        const rows = await db.select<any[]>('SELECT * FROM tasks');
        return rows.map(mapRowToTask);
    },

    async getById(id: string): Promise<Task | undefined> {
        const db = await getDb();
        const rows = await db.select<any[]>('SELECT * FROM tasks WHERE id = ?', [id]);
        return rows.length > 0 ? mapRowToTask(rows[0]) : undefined;
    },

    async getBySectionId(sectionId: string): Promise<Task[]> {
        const db = await getDb();
        const rows = await db.select<any[]>('SELECT * FROM tasks WHERE section_id = ?', [sectionId]);
        return rows.map(mapRowToTask);
    },

    async create(data: NewTask): Promise<Task> {
        const db = await getDb();
        const id = data.id || crypto.randomUUID();
        await db.execute(
            `INSERT INTO tasks (id, name, description, is_completed, creation_date, placement_date, recorded_time_in_secs, section_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                data.name,
                data.description,
                data.isCompleted ? 1 : 0,
                data.creationDate.getTime(),
                data.placementDate.getTime(),
                data.recordedTimeInSecs || 0,
                data.sectionId || null,
            ]
        );
        const result = await this.getById(id);
        if (!result) throw new Error('Failed to create task');
        return result;
    },

    async update(id: string, data: Partial<NewTask>): Promise<Task | undefined> {
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
        if (data.isCompleted !== undefined) {
            updates.push('is_completed = ?');
            values.push(data.isCompleted ? 1 : 0);
        }
        if (data.placementDate !== undefined) {
            updates.push('placement_date = ?');
            values.push(data.placementDate.getTime());
        }
        if (data.sectionId !== undefined) {
            updates.push('section_id = ?');
            values.push(data.sectionId);
        }

        if (updates.length > 0) {
            values.push(id);
            await db.execute(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`, values);
        }

        return this.getById(id);
    },

    async delete(id: string): Promise<void> {
        const db = await getDb();
        await db.execute('DELETE FROM tasks WHERE id = ?', [id]);
    },

    async addTag(taskId: string, tagId: string): Promise<void> {
        const db = await getDb();
        await db.execute('INSERT INTO task_tags (task_id, tag_id) VALUES (?, ?)', [taskId, tagId]);
    },

    async removeTag(taskId: string, tagId: string): Promise<void> {
        const db = await getDb();
        await db.execute('DELETE FROM task_tags WHERE task_id = ? AND tag_id = ?', [taskId, tagId]);
    },

    async getTags(taskId: string) {
        const db = await getDb();
        return db.select<any[]>(
            `SELECT t.* FROM tags t INNER JOIN task_tags tt ON t.id = tt.tag_id WHERE tt.task_id = ?`,
            [taskId]
        );
    },

    async addRelatedTask(taskId: string, relatedTaskId: string): Promise<void> {
        const db = await getDb();
        await db.execute('INSERT INTO task_relations (task_id, related_task_id) VALUES (?, ?)', [taskId, relatedTaskId]);
    },

    async removeRelatedTask(taskId: string, relatedTaskId: string): Promise<void> {
        const db = await getDb();
        await db.execute('DELETE FROM task_relations WHERE task_id = ? AND related_task_id = ?', [taskId, relatedTaskId]);
    },

    async getRelatedTasks(taskId: string) {
        const db = await getDb();
        return db.select<any[]>(
            `SELECT t.* FROM tasks t INNER JOIN task_relations tr ON t.id = tr.related_task_id WHERE tr.task_id = ?`,
            [taskId]
        );
    },
};