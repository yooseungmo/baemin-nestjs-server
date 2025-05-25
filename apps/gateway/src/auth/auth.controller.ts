import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Authorization } from 'apps/gateway/src/auth/decorator/authorization.decorator';

import { RegisterDto } from 'apps/gateway/src/auth/dto/register-dto';
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
  loginUser(@Authorization() token: string) {
    if (!token) {
      throw new UnauthorizedException('토큰을 입력헤주세요.');
    }

    return this.authService.login(token);
  }
}
