import { RpcInterceptor } from '@app/common/interceptor/rpc.interceptor';
import {
  Controller,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetUserInfoDto } from 'apps/user/src/user/dto/get-user-info.dto';
import { UserService } from 'apps/user/src/user/user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'get_user_info' })
  @UsePipes(ValidationPipe)
  @UseInterceptors(RpcInterceptor)
  getUserInfo(@Payload() data: GetUserInfoDto) {
    return this.userService.getUserById(data.userId);
  }
}
