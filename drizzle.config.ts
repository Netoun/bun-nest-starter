import type { Config } from 'drizzle-kit';

export default {
  schema: './src/modules/**/*.schema.ts',
  out: './src/modules/db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL || './sqlite.db',
  },
} satisfies Config;
