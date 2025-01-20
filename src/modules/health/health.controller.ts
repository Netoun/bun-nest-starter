import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { HealthService } from 'src/modules/health/health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private dbService: HealthService
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.dbService.checkDb()]);
  }
}
