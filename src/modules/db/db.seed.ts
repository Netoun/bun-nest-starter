import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { reset, seed } from 'drizzle-seed';
import { todo } from '../todo/todo.schema';
import { user } from '../user/user.schema';

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite);

const schema = {
  user,
  todo,
};

async function main() {
  await reset(db, schema);

  await seed(db, schema).refine((f) => ({
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
