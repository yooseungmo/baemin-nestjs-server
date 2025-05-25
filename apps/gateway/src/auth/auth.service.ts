import { USER_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterDto } from 'apps/gateway/src/auth/dto/register-dto';

import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
