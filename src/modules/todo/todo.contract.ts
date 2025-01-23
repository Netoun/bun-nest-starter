import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { todoInsertSchema, todoSelectSchema, todosSelectSchema, todoUpdateSchema } from "./todo.schema";
import { extendZodWithOpenApi } from '@anatine/zod-openapi';

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
        title: 'List of todos',
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