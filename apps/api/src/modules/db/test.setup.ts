import { Database } from "bun:sqlite";
import { BunSQLiteDatabase, drizzle } from "drizzle-orm/bun-sqlite";
import { readMigrationFiles } from "drizzle-orm/migrator";
import { reset } from "drizzle-seed";
import { user } from "@/modules/user/user.schema";
import { todo } from "@/modules/todo/todo.schema";
import path from "node:path";

export const schema = {
  user,
  todo,
};

export async function setupTestDatabase() {
  const sqlite = new Database(":memory:");
  const db = drizzle(sqlite) as BunSQLiteDatabase<Record<string, never>> & {
    $client: Database;
  };

  const migrations = await readMigrationFiles({
    migrationsFolder: path.join(__dirname, "migrations"),
  });

  for (const migration of migrations) {
    for (const query of migration.sql) {
      await db.run(query);
    }
  }

  return db;
}

export async function resetTestDatabase(db: BunSQLiteDatabase) {
  await reset(db, schema);
}

export async function createTestUser(db: BunSQLiteDatabase) {
  const [testUser] = await db
    .insert(user)
    .values({
      id: "1",
      email: "test@example.com",
      name: "Test User",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return testUser;
} 