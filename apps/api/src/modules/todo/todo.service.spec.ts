import { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import { beforeEach, describe, expect, it } from "vitest";
import { TodoService } from "./todo.service";
import { createTestUser, setupTestDatabase } from "@/modules/db/test.setup";
import { todo } from "@nest-bun-drizzle/database";

describe("TodoService", () => {
  let todoService: TodoService;
  let db: BunSQLiteDatabase;
  
  beforeEach(async () => {
    db = await setupTestDatabase();
    await createTestUser(db);
    todoService = new TodoService(db);
  });

  describe("create", () => {
    it("should create a new todo", async () => {
      const userId = "1";
      const newTodo = {
        title: "Test Todo",
        description: "Test Description",
        userId,
        completed: false,
      };

      const result = await todoService.create(newTodo);

      expect(result).toMatchObject({
        ...newTodo,
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('findAll', () => {
    it('should return all todos for a user', async () => {
      const userId = '1';

      // Create test todos
      await todoService.create({
        title: 'Todo 1',
        description: 'Description 1',
        userId,
        completed: false,
      });

      await todoService.create({
        title: 'Todo 2',
        description: 'Description 2',
        userId,
        completed: true,
      });
      const result = await todoService.findAll({ offset: 0, limit: 10, userId });

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        title: 'Todo 2',
        description: 'Description 2',
        userId,
        completed: true,
        id: expect.any(String)
      });
      expect(result[1]).toMatchObject({
        title: 'Todo 1',
        description: 'Description 1',
        userId,
        completed: false,
        id: expect.any(String)
      });
     
    });
  });

  describe('findOne', () => {
    it('should find a todo by id', async () => {
      const userId = '1';
      const [createdTodo] = await db.insert(todo).values({
        title: 'Test Todo',
        description: 'Test Description',
        userId,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();

      const result = await todoService.findOne(createdTodo.id);
      expect(result).toMatchObject({
        id: createdTodo.id,
        title: 'Test Todo',
        description: 'Test Description',
        userId,
        completed: false,
      });
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const userId = '1';
      const [createdTodo] = await db.insert(todo).values({
        title: 'Test Todo',
        description: 'Test Description',
        userId,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();

      const updateData = { title: 'Updated Title' };
      const result = await todoService.update(createdTodo.id, updateData);

      expect(result).toMatchObject({
        ...createdTodo,
        ...updateData,
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      const userId = '1';
      const [createdTodo] = await db.insert(todo).values({
        title: 'Test Todo',
        description: 'Test Description',
        userId,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();

      const result = await todoService.remove(createdTodo.id);
      expect(result).toMatchObject(createdTodo);

      const found = await todoService.findOne(createdTodo.id);
      expect(found).toBeUndefined();
    });
  });

  describe('toggleComplete', () => {
    it('should toggle todo completion status', async () => {
      const userId = '1';
      const [createdTodo] = await db.insert(todo).values({
        title: 'Test Todo',
        description: 'Test Description',
        userId,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();

      const result = await todoService.toggleComplete(createdTodo.id, userId);
      expect(result).toMatchObject({
        ...createdTodo,
        completed: true,
        updatedAt: expect.any(Date),
      });

      const toggledBack = await todoService.toggleComplete(createdTodo.id, userId);
      expect(toggledBack).toMatchObject({
        ...createdTodo,
        completed: false,
        updatedAt: expect.any(Date),
      });
    });

    it('should return undefined if todo not found', async () => {
      const result = await todoService.toggleComplete('non-existent-id', '1');
      expect(result).toBeUndefined();
    });
  });
});
