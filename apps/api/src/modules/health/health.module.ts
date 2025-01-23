import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { DatabaseModule } from '@/modules/db/db.module';
import { HealthService } from '@/modules/health/health.service';

@Module({
  imports: [DatabaseModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
