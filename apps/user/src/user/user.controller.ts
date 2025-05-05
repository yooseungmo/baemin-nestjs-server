import { Controller } from '@nestjs/common';
import { UserService } from 'apps/user/src/user/user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
}
