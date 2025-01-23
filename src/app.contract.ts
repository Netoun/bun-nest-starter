import { initContract } from '@ts-rest/core';
import { generateOpenApi } from '@ts-rest/open-api';
import { todoContract } from 'src/modules/todo/todo.contract';
import { userContract } from 'src/modules/user/user.contract';

const c = initContract();

const contract = c.router({
  users: userContract,
  todos: todoContract,
});

export const openApiDocument = generateOpenApi(contract, {
  info: {
    title: 'Posts API',
    version: '1.0.0',
  },
});
