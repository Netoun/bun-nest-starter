import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { userZodSchemas } from "@nest-bun-drizzle/db";
import { extendZodWithOpenApi } from '@anatine/zod-openapi';

const { insert, findOne, findAll, update } = userZodSchemas;

extendZodWithOpenApi(z);

const c = initContract();
export const userContract = c.router({
  createUser: {
    method: "POST",
    path: "/users",
    responses: {
      201: findOne,
    },
    body: insert,
    summary: "Create a user",
    metadata: { role: "user" } as const,
  },
  getUsers: {
    method: "GET",
    path: "/users",
    responses: {
      200: findAll.openapi({
        title: 'List of users',
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
      200: findOne,
    },
    summary: "Get a user",
    metadata: { role: "guest" } as const,
  },
  updateUser: {
    method: "PATCH",
    path: "/users/:id",
    responses: {
      200: findOne,
    },
    body: update,
    summary: "Update a user",
    metadata: { role: "user" } as const,
  },
  deleteUser: {
    method: "DELETE",
    path: "/users/:id",
    responses: {
      200: findOne,
    },
    summary: "Delete a user",
    metadata: { role: "user" } as const,
  },
}); 