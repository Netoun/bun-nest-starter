import type { BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { todo } from './todo.schema';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let todoService: TodoService;
  let mockDb: BunSQLiteDatabase;

  beforeEach(() => {
    mockDb = {
      insert: vi.fn(),
      select: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as BunSQLiteDatabase;

    todoService = new TodoService(mockDb);
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const userId = '1';
      const newTodo = {
        title: 'Test Todo',
        description: 'Test Description',
        userId,
        completed: false,
      };

      const expectedTodo = {
        id: '1',
        ...newTodo,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockDb.insert as unknown as Mock).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([expectedTodo]),
        }),
      });

      const result = await todoService.create(newTodo);
      expect(result).toEqual(expectedTodo);
      expect(mockDb.insert).toHaveBeenCalledWith(todo);
    });
  });

  describe('findAll', () => {
    it('should return all todos for a user', async () => {
      const userId = '1';
      const mockTodos = [
        {
          id: '1',
          title: 'Test Todo',
          description: 'Test Description',
          userId,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (mockDb.select as unknown as Mock).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(mockTodos),
        }),
      });

      const result = await todoService.findAll(userId);
      expect(result).toEqual(mockTodos);
    });
  });

  describe('findOne', () => {
    it('should find a todo by id and userId', async () => {
      const todoId = '1';
      const userId = '1';
      const expectedTodo = {
        id: todoId,
        title: 'Test Todo',
        description: 'Test Description',
        userId,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockDb.select as unknown as Mock).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([expectedTodo]),
        }),
      });

      const result = await todoService.findOne(todoId, userId);
      expect(result).toEqual(expectedTodo);
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const todoId = '1';
      const userId = '1';
      const updateData = { title: 'Updated Title' };
      const expectedTodo = {
        id: todoId,
        title: 'Updated Title',
        description: 'Test Description',
        userId,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockDb.update as unknown as Mock).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([expectedTodo]),
          }),
        }),
      });

      const result = await todoService.update(todoId, userId, updateData);
      expect(result).toEqual(expectedTodo);
    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      const todoId = '1';
      const userId = '1';
      const deletedTodo = {
        id: todoId,
        title: 'Test Todo',
        description: 'Test Description',
        userId,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockDb.delete as unknown as Mock).mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([deletedTodo]),
        }),
      });

      const result = await todoService.remove(todoId, userId);
      expect(result).toEqual(deletedTodo);
    });
  });

  describe('toggleComplete', () => {
    it('should toggle todo completion status', async () => {
      const todoId = '1';
      const userId = '1';
      const existingTodo = {
        id: todoId,
        title: 'Test Todo',
        description: 'Test Description',
        userId,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const expectedTodo = {
        ...existingTodo,
        completed: true,
        updatedAt: new Date(),
      };

      (mockDb.select as unknown as Mock).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([existingTodo]),
        }),
      });

      (mockDb.update as unknown as Mock).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([expectedTodo]),
          }),
        }),
      });

      const result = await todoService.toggleComplete(todoId, userId);
      expect(result).toEqual(expectedTodo);
    });

    it('should return undefined if todo not found', async () => {
      const todoId = '1';
      const userId = '1';

      (mockDb.select as unknown as Mock).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      const result = await todoService.toggleComplete(todoId, userId);
      expect(result).toBeUndefined();
    });
  });
});
