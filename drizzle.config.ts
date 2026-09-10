import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/shared/services/schema.ts',
    out: './drizzle',
    dialect: 'sqlite',
    dbCredentials: {
        url: './todo.db',
    },
});
