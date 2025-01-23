import { Database } from "bun:sqlite";
import { BunSQLiteDatabase, drizzle } from "drizzle-orm/bun-sqlite";
import type { SQLiteSelect } from "drizzle-orm/sqlite-core";
import { z } from "zod";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { reset } from "drizzle-seed";
import { user } from "./schema/user.schema";
import { todo } from "./schema/todo.schema";


const paginationSchema = z.object({
  offset: z.coerce.number(),
  limit: z.coerce.number(),
});

export type Pagination = z.infer<typeof paginationSchema>;

export function withPagination<T extends SQLiteSelect>(
  qb: T,
  pagination: Pagination
) {
  const { offset, limit } = paginationSchema.parse(pagination);
  return qb.offset(offset).limit(limit);
}

type InitDbOptions = {
  isMemory: boolean;
};

export function initDB(options: InitDbOptions) {
  let dbPath = options.isMemory ? ":memory:" : process.env.DATABASE_URL || "./sqlite.db";
  if (options.isMemory) {
    dbPath = ":memory:";
  } else {
    const dbName = process.env.DATABASE_URL || "./sqlite.db";
    const absolutePath =  path.resolve(process.cwd(), "../../", dbName);
    dbPath = absolutePath;
  }
  const sqlite = new Database(dbPath);
  return drizzle(sqlite);
}

type RunMigrationsOptions = {
  isMemory: boolean;
};

export async function runMigrations(options: RunMigrationsOptions) {
  try {
    const db = initDB(options);
    const currentFilePath = fileURLToPath(import.meta.url);
    const migrationsPath = path.join(path.dirname(currentFilePath), "migrations");

    await migrate(db, { migrationsFolder: migrationsPath });
    return db;
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

export function resetDB(db: BunSQLiteDatabase) {
  return reset(db, {
    user,
    todo,
  });
}
