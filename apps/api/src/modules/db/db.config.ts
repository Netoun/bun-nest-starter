import { utils } from '@nest-bun-drizzle/db';

export const db = utils.initDB({ isMemory: false });
