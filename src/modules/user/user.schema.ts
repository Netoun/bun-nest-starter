import { randomUUID } from 'node:crypto';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

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

export type User = InferSelectModel<typeof user>;
export type NewUser = InferInsertModel<typeof user>;
