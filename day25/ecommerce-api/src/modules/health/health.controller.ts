import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @ApiOperation({ summary: 'Check server health status' })
  @Get()
  check() {
    return this.healthService.check();
  }
  @Get('test-error')
  testError() {
    throw new Error('Test 500 error for Telegram alert!');
  }
}
