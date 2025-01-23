import { BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { user } from './user.schema';
import { UserService } from './user.service';
import { createTestUser, resetTestDatabase, setupTestDatabase } from '@/modules/db/test.setup';
import { todo } from '@/modules/todo/todo.schema';

describe('UserService', () => {
  let userService: UserService;
  let db: BunSQLiteDatabase;

  beforeAll(async () => {
    db = await setupTestDatabase();
  });

  beforeEach(async () => {
    await resetTestDatabase(db);
    await createTestUser(db);
    userService = new UserService(db);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const newUser = {
        name: 'New User',
        email: 'new@example.com',
      };

      const result = await userService.create(newUser);

      expect(result).toMatchObject({
        ...newUser,
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('findAll', () => {
    it('should return users with todo count', async () => {

      await db.insert(todo).values({
        title: 'Todo 1',
        description: 'Description 1',
        userId: '1',
        completed: false,
      });

      const pagination = { offset: 0, limit: 10 };
      const result = await userService.findAll(pagination);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        todoCount: 1,
      });
    });
  });

  describe('findOne', () => {
    it('should find a user by id', async () => {
      const result = await userService.findOne('1');

      expect(result).toMatchObject({
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      });
    });

    it('should return undefined if user not found', async () => {
      const result = await userService.findOne('non-existent-id');
      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateData = { name: 'Updated Name' };
      const result = await userService.update('1', updateData);

      expect(result).toMatchObject({
        id: '1',
        name: 'Updated Name',
        email: 'test@example.com',
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const result = await userService.remove('1');

      expect(result).toMatchObject({
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
      });

      const found = await userService.findOne('1');
      expect(found).toBeUndefined();
    });
  });
});
