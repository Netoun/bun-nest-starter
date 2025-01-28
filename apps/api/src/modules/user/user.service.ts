import { Inject, Injectable } from "@nestjs/common";
import { count, desc, eq } from "drizzle-orm";
import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import {
  todo,
  user,
} from "@nest-bun-drizzle/database";
import type { UserInsert, UserSelect, UsersSelect } from "@nest-bun-drizzle/shared";
import type { Pagination } from "@nest-bun-drizzle/shared";

@Injectable()
export class UserService {
  constructor(@Inject("DATABASE") private readonly db: BunSQLiteDatabase) {}

  async create(
    createUserDto: UserInsert
  ): Promise<UserSelect> {
    const [newUser] = await this.db
      .insert(user)
      .values(createUserDto)
      .returning();
    return newUser;
  }

  async findAll(pagination: Pagination): Promise<UsersSelect> {
    // 1. Select users ids with pagination
    const paginatedUsers = this.db
      .$with("paginated_users")
      .as(
        this.db
          .select({ id: user.id })
          .from(user)
          .orderBy(desc(user.createdAt))
          .offset(Number(pagination.offset))
          .limit(Number(pagination.limit))
      );

    // 2. Calculate todos count per user
    const userTodoCounts = this.db.$with("user_todo_counts").as(
      this.db
        .with(paginatedUsers)
        .select({
          userId: paginatedUsers.id,
          todoCount: count(todo.id).as("todo_count"),
        })
        .from(todo)
        .innerJoin(paginatedUsers, eq(todo.userId, paginatedUsers.id))
        .groupBy(todo.userId)
    );

    // 3. Join user info with todos count
    return this.db
      .with(userTodoCounts)
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        todoCount: userTodoCounts.todoCount,
      })
      .from(user)
      .innerJoin(userTodoCounts, eq(user.id, userTodoCounts.userId))
      .orderBy(desc(userTodoCounts.todoCount));
  }

  async findOne(id: string): Promise<UserSelect | undefined> {
    const [foundUser] = await this.db
      .select()
      .from(user)
      .where(eq(user.id, id));
    return foundUser;
  }

  async update(
    id: string,
    updateUserDto: UserInsert
  ): Promise<UserSelect | undefined> {
    const [updatedUser] = await this.db
      .update(user)
      .set({ ...updateUserDto, updatedAt: new Date() })
      .where(eq(user.id, id))
      .returning();
    return updatedUser;
  }

  async remove(id: string): Promise<UserSelect | undefined> {
    const [deletedUser] = await this.db
      .delete(user)
      .where(eq(user.id, id))
      .returning();
    return deletedUser;
  }
}
