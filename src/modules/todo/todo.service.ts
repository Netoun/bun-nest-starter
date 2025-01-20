import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import type { BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import { todo } from './todo.schema';
import type { NewTodo, Todo } from './todo.schema';

@Injectable()
export class TodoService {
  constructor(@Inject('DATABASE') private readonly db: BunSQLiteDatabase) {}

  async create(createTodoDto: NewTodo): Promise<Todo> {
    const [newTodo] = await this.db
      .insert(todo)
      .values(createTodoDto)
      .returning();
    return newTodo;
  }

  async findAll(userId: string): Promise<Todo[]> {
    return await this.db.select().from(todo).where(eq(todo.userId, userId));
  }

  async findOne(id: string, userId: string): Promise<Todo | undefined> {
    const [foundTodo] = await this.db
      .select()
      .from(todo)
      .where(and(eq(todo.id, id), eq(todo.userId, userId)));
    return foundTodo;
  }

  async update(
    id: string,
    userId: string,
    updateTodoDto: Partial<NewTodo>
  ): Promise<Todo | undefined> {
    const [updatedTodo] = await this.db
      .update(todo)
      .set({ ...updateTodoDto, updatedAt: new Date() })
      .where(and(eq(todo.id, id), eq(todo.userId, userId)))
      .returning();
    return updatedTodo;
  }

  async remove(id: string, userId: string): Promise<Todo | undefined> {
    const [deletedTodo] = await this.db
      .delete(todo)
      .where(and(eq(todo.id, id), eq(todo.userId, userId)))
      .returning();
    return deletedTodo;
  }

  async toggleComplete(id: string, userId: string): Promise<Todo | undefined> {
    const todoToUpdate = await this.findOne(id, userId);
    if (!todoToUpdate) return undefined;

    const [updatedTodo] = await this.db
      .update(todo)
      .set({ completed: !todo.completed, updatedAt: new Date() })
      .where(and(eq(todo.id, id), eq(todo.userId, userId)))
      .returning();
    return updatedTodo;
  }
}
