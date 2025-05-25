import { PAYMENT_SERVICE, PRODUCT_SERVICE, USER_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOrderDto } from 'apps/order/src/order/dto/create-order.dto';
import { PaymentCancelledExcpetion } from 'apps/order/src/order/exception/payment-cancelled.exception';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { AddressDto } from './dto/address.dto';
import { PaymentDto } from './dto/payment.dto';
import { Customer } from './entity/customer.entity';
import { Order, OrderStatus } from './entity/order.entity';
import { Product } from './entity/product.entity';
import { PaymentFailedException } from './exception/payment-failed.exception';

@Injectable()
export class OrderService {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: ClientProxy,
    @Inject(PRODUCT_SERVICE)
    private readonly productService: ClientProxy,
    @Inject(PAYMENT_SERVICE)
    private readonly paymentService: ClientProxy,
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const { productIds, address, payment, token } = createOrderDto;
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

    /// 3) 총 금액 계산하기
    const totalAmount = this.calculateTotalAmount(products);

    /// 4) 금액 검증하기 - total이 맞는지 (프론트에서 보내준 데이터랑)
    this.validatePaymentAmount(totalAmount, payment.amount);

    /// 5) 주문 생성하기 - 데이터베이스에 넣기
    const customer = this.createCustomer(user);
    const order = await this.createNewOrder(
      customer,
      products,
      address,
      payment,
    );

    /// 6) 결제 시도하기
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    await this.processPayment(order._id.toString(), payment, user.email);

    /// 7) 결과 반환하기
    return this.orderModel.findById(order._id);
  }

  private async getUserFromToken(token: string) {
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

  private async getProductByIds(productIds: string[]): Promise<Product[]> {
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

  private calculateTotalAmount(product: Product[]) {
    return product.reduce((acc, next) => acc + next.price, 0);
  }

  private validatePaymentAmount(totalA: number, totalB: number) {
    if (totalA !== totalB) {
      throw new PaymentCancelledExcpetion('결제하려는 금액이 변경됐습니다!');
    }
  }

  private createCustomer(user: { id: string; email: string; name: string }) {
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
    };
  }

  private createNewOrder(
    customer: Customer,
    products: Product[],
    deliveryAddress: AddressDto,
    payment: PaymentDto,
  ) {
    return this.orderModel.create({
      customer,
      products,
      deliveryAddress,
      payment,
    });
  }

  async processPayment(
    orderId: string,
    payment: PaymentDto,
    userEmail: string,
  ) {
    try {
      const resp = await lastValueFrom(
        this.paymentService.send(
          { cmd: 'make_payment' },
          {
            ...payment,
            userEmail,
            orderId,
          },
        ),
      );

      if (resp.status === 'error') {
        throw new PaymentFailedException(resp);
      }

      const isPaid = resp.data.paymentStatus === 'Approved';
      const orderStatus = isPaid
        ? OrderStatus.paymentProcessed
        : OrderStatus.paymentFailed;

      if (orderStatus === OrderStatus.paymentFailed) {
        throw new PaymentFailedException(resp.error);
      }

      await this.orderModel.findByIdAndUpdate(orderId, {
        status: OrderStatus.paymentProcessed,
      });

      return resp;
    } catch (e) {
      if (e instanceof PaymentFailedException) {
        await this.orderModel.findByIdAndUpdate(orderId, {
          status: OrderStatus.paymentFailed,
        });
      }

      throw e;
    }
  }

  changeOrderStatus(orderId: string, status: OrderStatus) {
    return this.orderModel.findByIdAndUpdate(orderId, { status });
  }
}
