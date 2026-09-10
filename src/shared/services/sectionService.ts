import { eq } from 'drizzle-orm';
import { getDb, schema } from './db';
import type { Section, NewSection } from './schema';

export const sectionService = {
    async getAll(): Promise<Section[]> {
        const db = await getDb();
        return db.select().from(schema.sections).all();
    },

    async getById(id: string): Promise<Section | undefined> {
        const db = await getDb();
        return db.select().from(schema.sections).where(eq(schema.sections.id, id)).get();
    },

    async getByProjectId(projectId: string): Promise<Section[]> {
        const db = await getDb();
        return db.select().from(schema.sections).where(eq(schema.sections.projectId, projectId)).all();
    },

    async getByTagId(tagId: string): Promise<Section[]> {
        const db = await getDb();
        return db.select().from(schema.sections).where(eq(schema.sections.tagId, tagId)).all();
    },

    async create(data: NewSection): Promise<Section> {
        const db = await getDb();
        db.insert(schema.sections).values(data).run();
        return this.getById(data.id) as Promise<Section>;
    },

    async update(id: string, data: Partial<NewSection>): Promise<Section | undefined> {
        const db = await getDb();
        db.update(schema.sections).set(data).where(eq(schema.sections.id, id)).run();
        return this.getById(id);
    },

    async delete(id: string): Promise<void> {
        const db = await getDb();
        db.delete(schema.sections).where(eq(schema.sections.id, id)).run();
    },
};
