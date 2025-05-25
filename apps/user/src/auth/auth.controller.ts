import { RpcInterceptor } from '@app/common';
import {
  Controller,
  UnauthorizedException,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginDto } from 'apps/user/src/auth/dto/login.dto';
import { ParseBearerTokenDto } from 'apps/user/src/auth/dto/parse-bearer-token.dto';
import { RegisterDto } from 'apps/user/src/auth/dto/register-dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('register')
  // @UsePipes(ValidationPipe)
  // registerUser(
  //   @Authorization() token: string,
  //   @Body() registerDto: RegisterDto,
  // ) {
  //   if (!token) {
  //     throw new UnauthorizedException('토큰을 입력헤주세요.');
  //   }

  //   return this.authService.register(token, registerDto);
  // }

  // @Post('login')
  // @UsePipes(ValidationPipe)
  // loginUser(@Authorization() token: string) {
  //   if (!token) {
  //     throw new UnauthorizedException('토큰을 입력헤주세요.');
  //   }

  //   return this.authService.login(token);
  // }

  @MessagePattern({
    cmd: 'parse_bearer_token',
  })
  @UsePipes(ValidationPipe)
  @UseInterceptors(RpcInterceptor)
  parseBearerToken(@Payload() payload: ParseBearerTokenDto) {
    return this.authService.parseBearerToken(payload.token, false);
  }

  @MessagePattern({
    cmd: 'register',
  })
  registerUser(@Payload() registerDto: RegisterDto) {
    const { token } = registerDto;
    if (!token) {
      throw new UnauthorizedException('토큰을 입력헤주세요.');
    }

    return this.authService.register(token, registerDto);
  }

  @MessagePattern({
    cmd: 'login',
  })
  loginUser(@Payload() loginDto: LoginDto) {
    const { token } = loginDto;
    if (!token) {
      throw new UnauthorizedException('토큰을 입력헤주세요.');
    }

    return this.authService.login(token);
  }
}
