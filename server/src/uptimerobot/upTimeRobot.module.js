import { Module } from '@nestjs/common';
import { UpTimeRobotController } from './upTimeRobot.controller';

@Module({
  controllers: [UpTimeRobotController],
})
export class UpTimeRobotModule {}
