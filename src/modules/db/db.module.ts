import { Database } from 'bun:sqlite';
import { Global, Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/bun-sqlite';

const sqlite = new Database('sqlite.db');
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
