import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSchema } from './user.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({})
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}