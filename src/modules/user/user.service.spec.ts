import type { BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { user } from './user.schema';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let mockDb: BunSQLiteDatabase;

  beforeEach(() => {
    mockDb = {
      insert: vi.fn(),
      select: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      $with: vi.fn(),
      with: vi.fn(),
    } as unknown as BunSQLiteDatabase;

    userService = new UserService(mockDb);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
      };

      const expectedUser = {
        id: '1',
        ...newUser,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockDb.insert as unknown as Mock).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([expectedUser]),
        }),
      });

      const result = await userService.create(newUser);
      expect(result).toEqual(expectedUser);
      expect(mockDb.insert).toHaveBeenCalledWith(user);
    });
  });

  describe('findAll', () => {
    it('should return users with todo count', async () => {
      const pagination = { offset: 0, limit: 10 };
      const mockUsers = [
        {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
          todoCount: 2,
        },
      ];

      // Mock the inner select for paginated users
      const mockInnerSelect = {
        from: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockReturnValue({
            offset: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({ id: '1' }),
            }),
          }),
        }),
      };

      // Mock the first $with call for paginated users
      (mockDb.$with as unknown as Mock).mockReturnValueOnce({
        as: vi.fn().mockReturnValue({ id: '1' }),
      });

      // Mock the second $with call for user todo counts
      (mockDb.$with as unknown as Mock).mockReturnValueOnce({
        as: vi.fn().mockReturnValue({ userId: '1', todoCount: 2 }),
      });

      // Mock the select method for the inner query
      (mockDb.select as unknown as Mock).mockReturnValueOnce(mockInnerSelect);

      // Mock the with method for the intermediate query
      (mockDb.with as unknown as Mock).mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            innerJoin: vi.fn().mockReturnValue({
              groupBy: vi.fn().mockReturnValue({ userId: '1', todoCount: 2 }),
            }),
          }),
        }),
      });

      // Mock the with method for the final query
      (mockDb.with as unknown as Mock).mockReturnValue({
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            innerJoin: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockResolvedValue(mockUsers),
            }),
          }),
        }),
      });

      const result = await userService.findAll(pagination);
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should find a user by id', async () => {
      const userId = '1';
      const expectedUser = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockDb.select as unknown as Mock).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([expectedUser]),
        }),
      });

      const result = await userService.findOne(userId);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = '1';
      const updateData = { name: 'Updated Name' };
      const expectedUser = {
        id: userId,
        name: 'Updated Name',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockDb.update as unknown as Mock).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([expectedUser]),
          }),
        }),
      });

      const result = await userService.update(userId, updateData);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = '1';
      const deletedUser = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockDb.delete as unknown as Mock).mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([deletedUser]),
        }),
      });

      const result = await userService.remove(userId);
      expect(result).toEqual(deletedUser);
    });
  });
});
