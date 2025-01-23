import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [],
})
export class AppModule {
  static async forRoot() {
    const { DatabaseModule } = await import('./modules/db/db.module');
    const { UserModule } = await import('./modules/user/user.module');
    const { TodoModule } = await import('./modules/todo/todo.module');
    const { HealthModule } = await import('./modules/health/health.module');
    return {
      module: AppModule,
      imports: [
        CacheModule.registerAsync({
          isGlobal: true,
          useFactory: async () => ({
            store: await redisStore({
              url: process.env.REDIS_URL || 'redis://localhost:6379',
              ttl: 60000, // 1 minute default TTL
            }),
          }),
        }),
        DatabaseModule,
        UserModule,
        TodoModule,
        HealthModule,
      ],
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: CacheInterceptor,
        },
      ],
    };
  }
}
