import { initContract } from '@ts-rest/core';
import { todoContract } from './todo.contract';
import { userContract } from './user.contract';

export * from './user.contract';
export * from './todo.contract'; 

const c = initContract();

export const contract = c.router({
  userContract,
  todoContract,
});

export { paginationSchema } from "@nest-bun-drizzle/database";
export type { Pagination } from "@nest-bun-drizzle/database";
