import type { Config } from 'drizzle-kit';

export default {
  schema: './src/schema',
  out: './src/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL || './sqlite.db',
  },
} satisfies Config; 