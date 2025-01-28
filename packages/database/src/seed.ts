import { reset, seed } from 'drizzle-seed';
import { user } from './schema/user.schema';
import { todo } from './schema/todo.schema';
import { initDB } from './utils';

async function main() {
  const db = initDB({ isMemory: false });

  const schema = {
    user,
    todo,
  };

  await reset(db, schema);

  await seed(db, schema).refine(() => ({
    user: {
      count: 100000,
      with: {
        todo: [
          { weight: 0.6, count: [1, 2, 3] },
          { weight: 0.3, count: [5, 6, 7] },
          { weight: 0.1, count: [8, 9, 10] },
        ],
      },
    },
  }));
}

main();
