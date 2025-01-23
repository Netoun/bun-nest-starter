import { randomUUID } from "node:crypto";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";
import { user } from "./user.schema";

export const todo = sqliteTable(
  "todo",
  {
    id: text("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    title: text("title").notNull(),
    description: text("description"),
    completed: integer("completed", { mode: "boolean" })
      .notNull()
      .default(false),
    userId: text("user_id", { length: 36 })
      .notNull()
      .references(() => user.id),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
    completedUserIdIdx: index("completed_user_id_idx").on(
      table.completed,
      table.userId
    ),
    createdAtIdx: index("created_at_idx").on(table.createdAt),
    titleIdx: index("title_idx").on(table.title),
  })
);

const todoSelectSchema = createSelectSchema(todo).omit({
  createdAt: true,
  updatedAt: true,
});
type TodoSelect = z.infer<typeof todoSelectSchema>;

const todoInsertSchema = createInsertSchema(todo).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
type TodoInsert = z.infer<typeof todoInsertSchema>;

const todoUpdateSchema = createUpdateSchema(todo).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
});
type TodoUpdate = z.infer<typeof todoUpdateSchema>;

const todosSelectSchema = todoSelectSchema.array();
type TodosSelect = z.infer<typeof todosSelectSchema>;

export const todoZodSchemas = {
  findOne: todoSelectSchema,
  findAll: todosSelectSchema,
  insert: todoInsertSchema,
  update: todoUpdateSchema,
};

export type TodoZodSchemas = {
  findOne: TodoSelect;
  findAll: TodosSelect;
  insert: TodoInsert;
  update: TodoUpdate;
};
