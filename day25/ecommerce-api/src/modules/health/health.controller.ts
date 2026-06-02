import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler/dist/throttler.decorator';
@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @SkipThrottle()
  @ApiOperation({ summary: 'Check server health status' })
  @Get()
  check() {
    return this.healthService.check();
  }
  // @Get('test-error')
  // testError() {
  //   throw new Error('Test 500 error for stack trace!');
  // }
}
