import { PRODUCT_SERVICE, USER_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from 'apps/order/src/order/dto/create-order.dto';
import { PaymentCancelledExcpetion } from 'apps/order/src/order/exception/payment-cancelled.exception';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrderService {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: ClientProxy,
    @Inject(PRODUCT_SERVICE)
    private readonly productService: ClientProxy,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, token: string) {
    const { productIds, address, payment } = createOrderDto;
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

    const products = await this.getProductByIds(productIds);
  }

  async getUserFromToken(token: string) {
    // 1. User MS: JWT 검증
    const tRes = await lastValueFrom(
      this.userService.send({ cmd: 'parse_bearer_token' }, { token }),
    );

    if (tRes.status === 'error') {
      throw new PaymentCancelledExcpetion(tRes);
    }

    // 2. User MS: 사용자 정보 가져오기
    const userId = tRes.data.sub;
    const uRes = await lastValueFrom(
      this.userService.send({ cmd: 'get_user_info' }, { userId }),
    );

    if (uRes.status === 'error') {
      throw new PaymentCancelledExcpetion(uRes);
    }

    return uRes.data;
  }

  async getProductByIds(productIds: string[]) {
    const res = await lastValueFrom(
      this.productService.send(
        { cmd: 'get_productst_info' },
        {
          productIds,
        },
      ),
    );

    if (res.status === 'error') {
      throw new PaymentCancelledExcpetion('상품 정보가 잘못 됐습니다.');
    }

    /// Product 엔티티로 전환
    return res.data.map((product) => ({
      productId: product.id,
      name: product.name,
      price: product.price,
    }));
  }
}
