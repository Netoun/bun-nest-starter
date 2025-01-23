import { user, utils } from "@nest-bun-drizzle/db";
import { resetDB } from "@nest-bun-drizzle/db/dist/utils";
import type { Database } from "bun:sqlite";

type DB = Awaited<ReturnType<typeof utils.runMigrations>>;

export async function setupTestDatabase() {
  const db = await utils.runMigrations({ isMemory: true });
  return db;
}

export async function createTestUser(db: DB) {
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