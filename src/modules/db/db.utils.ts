import type { SQLiteSelect } from 'drizzle-orm/sqlite-core';
import { z } from 'zod';

const paginationSchema = z.object({
  offset: z.coerce.number(),
  limit: z.coerce.number(),
});

export type Pagination = z.infer<typeof paginationSchema>;

export function withPagination<T extends SQLiteSelect>(
  qb: T,
  pagination: Pagination
) {
  const { offset, limit } = paginationSchema.parse(pagination);
  return qb.offset(offset).limit(limit);
}
