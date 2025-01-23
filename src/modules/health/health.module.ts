import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { DatabaseModule } from 'src/modules/db/db.module';
import { HealthService } from 'src/modules/health/health.service';

@Module({
  imports: [DatabaseModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
