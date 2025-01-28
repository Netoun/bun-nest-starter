import { user } from "@nest-bun-drizzle/database";
import { runMigrations } from "@nest-bun-drizzle/database";

type DB = Awaited<ReturnType<typeof runMigrations>>;

export async function setupTestDatabase() {
  const db = await runMigrations({ isMemory: true });
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