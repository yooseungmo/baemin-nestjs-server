import { RpcInterceptor } from '@app/common/interceptor/rpc.interceptor';
import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Authorization } from 'apps/user/src/auth/decorator/authorization.decorator';
import { ParseBearerTokenDto } from 'apps/user/src/auth/dto/parse-bearer-token.dto';
import { RegisterDto } from 'apps/user/src/auth/dto/register-dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  registerUser(
    @Authorization() token: string,
    @Body() registerDto: RegisterDto,
  ) {
    if (!token) {
      throw new UnauthorizedException('토큰을 입력헤주세요.');
    }

    return this.authService.register(token, registerDto);
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  loginUser(@Authorization() token: string) {
    if (!token) {
      throw new UnauthorizedException('토큰을 입력헤주세요.');
    }

    return this.authService.login(token);
  }

  @MessagePattern({
    cmd: 'parse_bearer_token',
  })
  @UsePipes(ValidationPipe)
  @UseInterceptors(RpcInterceptor)
  parseBearerToken(@Payload() payload: ParseBearerTokenDto) {
    return this.authService.parseBearerToken(payload.token, false);
  }
}
