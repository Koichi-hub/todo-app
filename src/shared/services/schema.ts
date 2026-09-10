import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';

export const tags = sqliteTable('tags', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
});

export const projects = sqliteTable('projects', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    creationDate: integer('creation_date', { mode: 'timestamp' }).notNull(),
    tagId: text('tag_id').references(() => tags.id),
});

export const sections = sqliteTable('sections', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    creationDate: integer('creation_date', { mode: 'timestamp' }).notNull(),
    projectId: text('project_id').references(() => projects.id),
    tagId: text('tag_id').references(() => tags.id),
});

export const tasks = sqliteTable('tasks', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    isCompleted: integer('is_completed', { mode: 'boolean' }).notNull().default(false),
    creationDate: integer('creation_date', { mode: 'timestamp' }).notNull(),
    placementDate: integer('placement_date', { mode: 'timestamp' }).notNull(),
    recordedTimeInSecs: integer('recorded_time_in_secs').notNull().default(0),
    sectionId: text('section_id').references(() => sections.id),
});

export const taskTags = sqliteTable('task_tags', {
    taskId: text('task_id').notNull().references(() => tasks.id),
    tagId: text('tag_id').notNull().references(() => tags.id),
}, (table) => ({
    pk: primaryKey({ columns: [table.taskId, table.tagId] }),
}));

export const taskRelations = sqliteTable('task_relations', {
    taskId: text('task_id').notNull().references(() => tasks.id),
    relatedTaskId: text('related_task_id').notNull().references(() => tasks.id),
}, (table) => ({
    pk: primaryKey({ columns: [table.taskId, table.relatedTaskId] }),
}));

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Section = typeof sections.$inferSelect;
export type NewSection = typeof sections.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
