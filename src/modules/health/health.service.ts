import { Inject, Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicatorResult } from '@nestjs/terminus';
import { BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';

@Injectable()
export class HealthService {
  constructor(@Inject('DATABASE') private readonly db: BunSQLiteDatabase) {}

  async checkDb(): Promise<HealthIndicatorResult> {
    try {
      await this.db.run('SELECT 1');
      return {
        database: {
          status: 'up',
        },
      };
    } catch (error) {
      throw new HealthCheckError('Database health check failed', {
        database: {
          status: 'down',
          error: error.message,
        },
      });
    }
  }
}
