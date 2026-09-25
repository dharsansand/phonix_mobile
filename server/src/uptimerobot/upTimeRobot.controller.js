import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('uptimerobot')
export class UpTimeRobotController {
  @Get()
  @HttpCode(HttpStatus.OK)
  async getStatus() {
    return {
      status: 'success',
      message: 'Server is running good',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())} seconds`,
    };
  }
}
