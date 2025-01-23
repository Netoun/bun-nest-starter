import { Inject, Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import type { BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import { todo } from './todo.schema';
import type { TodoInsert, TodoUpdate, TodoSelect } from './todo.schema';
import { Pagination } from 'src/modules/db/db.utils';

@Injectable()
export class TodoService {
  constructor(@Inject('DATABASE') private readonly db: BunSQLiteDatabase) {}

  async create(data: TodoInsert) {
    const [newTodo] = await this.db.insert(todo).values(data).returning();
    return newTodo;
  }

  async findAll({ offset = 0, limit = 10, userId }: Pagination & { userId?: string }) {
    const query = userId ? eq(todo.userId, userId) : undefined;
    return this.db.select().from(todo).where(query).offset(offset).limit(limit);
  }

  async findOne(id: string) {
    const [foundTodo] = await this.db
      .select()
      .from(todo)
      .where(eq(todo.id, id))
      .limit(1);
    return foundTodo;
  }

  async update(id: string, data: TodoUpdate) {
    const [updatedTodo] = await this.db
      .update(todo)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(todo.id, id))
      .returning();
    return updatedTodo;
  }

  async remove(id: string) {
    const [deletedTodo] = await this.db
      .delete(todo)
      .where(eq(todo.id, id))
      .returning();
    return deletedTodo;
  }

  async toggleComplete(id: string, userId: string): Promise<TodoSelect | undefined> {
    const todoToUpdate = await this.findOne(id);
    if (!todoToUpdate) return undefined;

    const [updatedTodo] = await this.db
      .update(todo)
      .set({ completed: !todoToUpdate.completed, updatedAt: new Date() })
      .where(and(eq(todo.id, id), eq(todo.userId, userId)))
      .returning();
    return updatedTodo;
  }
}
