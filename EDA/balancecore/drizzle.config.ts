import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle/migrations',
  schema: './drizzle/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://postgres:postgres@postgres:5432/postgres',
  },
  verbose: true,
});
