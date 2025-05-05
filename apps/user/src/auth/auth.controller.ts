import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from 'apps/user/src/auth/dto/register-dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(token: string, @Body() registerDto: RegisterDto) {
    if (!token) {
      throw new UnauthorizedException('토큰을 입력헤주세요.');
    }

    // return this.authService.register(token, registerDto);
  }
}
