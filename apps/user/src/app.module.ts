import { Module } from '@nestjs/common';
import { UserModule } from 'apps/user/src/user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, AuthModule],
})
export class AppModule {}
