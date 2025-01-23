import { Inject, Injectable } from '@nestjs/common';
import { BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  database: {
    status: string;
    error?: string;
  };
  http: {
    status: string;
    error?: string;
  };
}

@Injectable()
export class HealthService {
  constructor(@Inject('DATABASE') private readonly db: BunSQLiteDatabase) {}

  async checkHealth(): Promise<HealthCheckResponse> {
    const [dbStatus] = await Promise.all([
      this.checkDb(),
    ]);

    const isHealthy = dbStatus.status === 'up';

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      http: {
        status: 'up',
      },
    };
  }

  private async checkDb(): Promise<{ status: string; error?: string }> {
    try {
      await this.db.run('SELECT 1');
      return { status: 'up' };
    } catch (error) {
      return { 
        status: 'down',
        error: error.message,
      };
    }
  }
}
