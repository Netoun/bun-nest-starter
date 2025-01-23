import { randomUUID } from 'node:crypto';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod';

export const user = sqliteTable(
  'user',
  {
    id: text('id', { length: 36 })
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    emailIdx: index('email_idx').on(table.email),
    createdAtIdx: index('created_at_idx').on(table.createdAt),
    nameIdx: index('name_idx').on(table.name),
  })
);

export const userSelectSchema = createSelectSchema(user).omit({
  createdAt: true,
  updatedAt: true,
});
export type UserSelect = z.infer<typeof userSelectSchema>;

export const userInsertSchema = createInsertSchema(user).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type UserInsert = z.infer<typeof userInsertSchema>;
export const userUpdateSchema = createUpdateSchema(user).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type UserUpdate = z.infer<typeof userUpdateSchema>;

export const usersSelectSchema = userSelectSchema.extend({
  todoCount: z.number(),
}).array();
export type UsersSelect = z.infer<typeof usersSelectSchema>;
