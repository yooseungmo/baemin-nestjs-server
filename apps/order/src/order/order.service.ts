import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from 'apps/order/src/order/dto/create-order.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrderService {
  constructor(
    @Inject('USER_SERVICE')
    private readonly userService: ClientProxy,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, token: string) {
    /**
     * 1. User: 사용자정보 갖고오기
     * 2. Product: 상품 정보 가져오기
     * 3. Order: 촘 금액 계산하기
     * 4. Product: 금액 검증하기 - 프론트에서 보내준 데이터 정확한지
     * 5. Order: 주문 생성하기 - DB save
     * 6. Payment: 결제 시도하기
     * 7. Notification: 주문 상태 업데이트 하기
     * 8. Order: 결과 반환하기
     */
    const user = await this.getUserFromToken(token);
  }

  async getUserFromToken(token: string) {
    const res = await lastValueFrom(
      this.userService.send({ cmd: 'parse_bearer_token' }, { token }),
    );
  }
}
