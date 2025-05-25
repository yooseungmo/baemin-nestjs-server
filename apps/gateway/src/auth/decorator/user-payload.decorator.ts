import { UserPayloadDto } from '@app/common';
import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const UserPayload = createParamDecorator<UserPayloadDto>(
  (date: any, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    const { user } = req;

    if (!user) {
      throw new InternalServerErrorException('TokenGuard 누락');
    }

    return req.user;
  },
);
