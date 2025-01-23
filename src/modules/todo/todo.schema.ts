import { randomUUID } from 'node:crypto';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod';
import { user } from '../user/user.schema';

export const todo = sqliteTable(
  'todo',
  {
    id: text('id', { length: 36 })
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    title: text('title').notNull(),
    description: text('description'),
    completed: integer('completed', { mode: 'boolean' })
      .notNull()
      .default(false),
    userId: text('user_id', { length: 36 })
      .notNull()
      .references(() => user.id),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    userIdIdx: index('user_id_idx').on(table.userId),
    completedUserIdIdx: index('completed_user_id_idx').on(
      table.completed,
      table.userId
    ),
    createdAtIdx: index('created_at_idx').on(table.createdAt),
    titleIdx: index('title_idx').on(table.title),
  })
);

export const todoSelectSchema = createSelectSchema(todo).omit({
  createdAt: true,
  updatedAt: true,
});
export type TodoSelect = z.infer<typeof todoSelectSchema>;

export const todoInsertSchema = createInsertSchema(todo).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type TodoInsert = z.infer<typeof todoInsertSchema>;

export const todoUpdateSchema = createUpdateSchema(todo).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
});
export type TodoUpdate = z.infer<typeof todoUpdateSchema>;

export const todosSelectSchema = todoSelectSchema.array();
export type TodosSelect = z.infer<typeof todosSelectSchema>;
