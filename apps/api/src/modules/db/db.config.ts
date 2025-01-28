import { initDB } from '@nest-bun-drizzle/database';

export const db = initDB({ isMemory: false });
