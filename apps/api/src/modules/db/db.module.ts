import { Database } from 'bun:sqlite';
import { Global, Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/bun-sqlite';

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error('DATABASE_URL is not set');
}
const sqlite = new Database(dbUrl);
export const db = drizzle(sqlite);

@Global()
@Module({
  providers: [
    {
      provide: 'DATABASE',
      useValue: db,
    },
  ],
  exports: ['DATABASE'],
})
export class DatabaseModule {}
