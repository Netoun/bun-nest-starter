import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { user } from "@nest-bun-drizzle/database";
import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

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

export const usersSelectSchema = userSelectSchema
  .extend({
    todoCount: z.number(),
  })
  .array();
export type UsersSelect = z.infer<typeof usersSelectSchema>;
extendZodWithOpenApi(z);

const c = initContract();
export const userContract = c.router({
  createUser: {
    method: "POST",
    path: "/users",
    responses: {
      201: userSelectSchema,
    },
    body: userInsertSchema,
    summary: "Create a user",
    metadata: { role: "user" } as const,
  },
  getUsers: {
    method: "GET",
    path: "/users",
    responses: {
      200: usersSelectSchema.openapi({
        title: "List of users",
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
    }),
    summary: "Get all users",
    metadata: { role: "guest" } as const,
  },
  getUser: {
    method: "GET",
    path: "/users/:id",
    responses: {
      200: userSelectSchema,
    },
    summary: "Get a user",
    metadata: { role: "guest" } as const,
  },
  updateUser: {
    method: "PATCH",
    path: "/users/:id",
    responses: {
      200: userSelectSchema,
    },
    body: userUpdateSchema,
    summary: "Update a user",
    metadata: { role: "user" } as const,
  },
  deleteUser: {
    method: "DELETE",
    path: "/users/:id",
    responses: {
      200: userSelectSchema,
    },
    summary: "Delete a user",
    metadata: { role: "user" } as const,
  },
});
