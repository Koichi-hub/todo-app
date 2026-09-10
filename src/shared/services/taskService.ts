import { eq, and } from 'drizzle-orm';
import { getDb, schema } from './db';
import type { Task, NewTask } from './schema';

export const taskService = {
    async getAll(): Promise<Task[]> {
        const db = await getDb();
        return db.select().from(schema.tasks).all();
    },

    async getById(id: string): Promise<Task | undefined> {
        const db = await getDb();
        return db.select().from(schema.tasks).where(eq(schema.tasks.id, id)).get();
    },

    async getBySectionId(sectionId: string): Promise<Task[]> {
        const db = await getDb();
        return db.select().from(schema.tasks).where(eq(schema.tasks.sectionId, sectionId)).all();
    },

    async create(data: NewTask): Promise<Task> {
        const db = await getDb();
        return db.insert(schema.tasks).values(data).returning().get();
    },

    async update(id: string, data: Partial<NewTask>): Promise<Task | undefined> {
        const db = await getDb();
        db.update(schema.tasks).set(data).where(eq(schema.tasks.id, id)).run();
        return this.getById(id);
    },

    async delete(id: string): Promise<void> {
        const db = await getDb();
        db.delete(schema.tasks).where(eq(schema.tasks.id, id)).run();
    },

    async addTag(taskId: string, tagId: string): Promise<void> {
        const db = await getDb();
        db.insert(schema.taskTags).values({ taskId, tagId }).run();
    },

    async removeTag(taskId: string, tagId: string): Promise<void> {
        const db = await getDb();
        db.delete(schema.taskTags)
            .where(and(eq(schema.taskTags.taskId, taskId), eq(schema.taskTags.tagId, tagId)))
            .run();
    },

    async getTags(taskId: string) {
        const db = await getDb();
        return db.select()
            .from(schema.tags)
            .innerJoin(schema.taskTags, eq(schema.tags.id, schema.taskTags.tagId))
            .where(eq(schema.taskTags.taskId, taskId))
            .all();
    },

    async addRelatedTask(taskId: string, relatedTaskId: string): Promise<void> {
        const db = await getDb();
        db.insert(schema.taskRelations).values({ taskId, relatedTaskId }).run();
    },

    async removeRelatedTask(taskId: string, relatedTaskId: string): Promise<void> {
        const db = await getDb();
        db.delete(schema.taskRelations)
            .where(and(eq(schema.taskRelations.taskId, taskId), eq(schema.taskRelations.relatedTaskId, relatedTaskId)))
            .run();
    },

    async getRelatedTasks(taskId: string) {
        const db = await getDb();
        return db.select()
            .from(schema.tasks)
            .innerJoin(schema.taskRelations, eq(schema.tasks.id, schema.taskRelations.relatedTaskId))
            .where(eq(schema.taskRelations.taskId, taskId))
            .all();
    },
};
