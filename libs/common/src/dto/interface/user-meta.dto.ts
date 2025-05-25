import { UserPayloadDto } from '@app/common/dto/user-payload.dto';

export interface UserMeta {
  meta: {
    user: UserPayloadDto;
  };
}
