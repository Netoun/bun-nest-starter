import { randomUUID } from 'node:crypto';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
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
    userId: text('user_id')
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
    createdAtIdx: index('todo_created_at_idx').on(table.createdAt),
  })
);

export type Todo = InferSelectModel<typeof todo>;
export type NewTodo = InferInsertModel<typeof todo>;
