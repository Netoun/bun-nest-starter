import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { todo } from "@nest-bun-drizzle/database";
import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

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

extendZodWithOpenApi(z);

const c = initContract();
export const todoContract = c.router({
  createTodo: {
    method: "POST",
    path: "/todos",
    responses: {
      201: todoSelectSchema,
    },
    body: todoInsertSchema,
    summary: "Create a todo",
    metadata: { role: "user" } as const,
  },
  getTodos: {
    method: "GET",
    path: "/todos",
    responses: {
      200: todosSelectSchema.openapi({
        title: "List of todos",
      }),
      400: z.object({
        type: z.string(),
        message: z.string(),
      }),
    },
    headers: z.object({
      pagination: z.string().optional(),
    }),
    query: z.object({
      limit: z.string().transform(Number).optional(),
      offset: z.string().transform(Number).optional(),
      userId: z.string().optional(),
    }),
    summary: "Get all todos",
    metadata: { role: "user" } as const,
  },
  getTodo: {
    method: "GET",
    path: "/todos/:id",
    responses: {
      200: todoSelectSchema,
    },
    summary: "Get a todo",
    metadata: { role: "user" } as const,
  },
  updateTodo: {
    method: "PATCH",
    path: "/todos/:id",
    responses: {
      200: todoSelectSchema,
    },
    body: todoUpdateSchema,
    summary: "Update a todo",
    metadata: { role: "user" } as const,
  },
  deleteTodo: {
    method: "DELETE",
    path: "/todos/:id",
    responses: {
      200: todoSelectSchema,
    },
    summary: "Delete a todo",
    metadata: { role: "user" } as const,
  },
});
