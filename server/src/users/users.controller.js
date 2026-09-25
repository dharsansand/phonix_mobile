import { Controller, Get, Post, Put, Delete, Body, Param, Dependencies,Bind,Req,UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from './auth.guard'; 

@Controller('users')
@Dependencies(UsersService)
export class UsersController {       
  constructor(usersService) {
    this.usersService = usersService;
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @Bind(Req()) // 👈 Use @Bind(Req()) here
  getMe(req) { // 👈 Keep parameter clean without '@'
    return this.usersService.getMe(req.user.sub);
  }

  @Get()
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Post()
  @Bind(Body()) 
  create(userData) {
    return this.usersService.create(userData);
  }

 @Post('login')
  @Bind(Body())
  login(loginData) {
    return this.usersService.login(loginData);
  }


    @Post('refresh')
  @Bind(Body())
  refreshTokens(body) {
    return this.usersService.refreshTokens(body.userId, body.refreshToken);
  }

   @Post('logout')
  @Bind(Body())
  logout(body) {
    return this.usersService.logout(body.userId);
  }
  
}