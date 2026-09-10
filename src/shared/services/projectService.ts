import { eq } from 'drizzle-orm';
import { getDb, schema } from './db';
import type { Project, NewProject } from './schema';

export const projectService = {
    async getAll(): Promise<Project[]> {
        const db = await getDb();
        return db.select().from(schema.projects).all();
    },

    async getById(id: string): Promise<Project | undefined> {
        const db = await getDb();
        return db.select().from(schema.projects).where(eq(schema.projects.id, id)).get();
    },

    async getByTagId(tagId: string): Promise<Project[]> {
        const db = await getDb();
        return db.select().from(schema.projects).where(eq(schema.projects.tagId, tagId)).all();
    },

    async create(data: NewProject): Promise<Project> {
        const db = await getDb();
        return db.insert(schema.projects).values(data).returning().get();
    },

    async update(id: string, data: Partial<NewProject>): Promise<Project | undefined> {
        const db = await getDb();
        db.update(schema.projects).set(data).where(eq(schema.projects.id, id)).run();
        return this.getById(id);
    },

    async delete(id: string): Promise<void> {
        const db = await getDb();
        db.delete(schema.projects).where(eq(schema.projects.id, id)).run();
    },
};
