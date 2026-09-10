import { eq } from 'drizzle-orm';
import { getDb, schema } from './db';
import type { Tag, NewTag } from './schema';

export const tagService = {
    async getAll(): Promise<Tag[]> {
        const db = await getDb();
        return db.select().from(schema.tags).all();
    },

    async getById(id: string): Promise<Tag | undefined> {
        const db = await getDb();
        const result = db.select().from(schema.tags).where(eq(schema.tags.id, id)).get();
        return result;
    },

    async create(data: NewTag): Promise<Tag> {
        const db = await getDb();
        return db.insert(schema.tags).values(data).returning().get();
    },

    async update(id: string, data: Partial<NewTag>): Promise<Tag | undefined> {
        const db = await getDb();
        db.update(schema.tags).set(data).where(eq(schema.tags.id, id)).run();
        return this.getById(id);
    },

    async delete(id: string): Promise<void> {
        const db = await getDb();
        db.delete(schema.tags).where(eq(schema.tags.id, id)).run();
    },
};
