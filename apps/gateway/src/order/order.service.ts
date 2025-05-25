import { ORDER_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from 'apps/gateway/src/order/dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_SERVICE)
    private readonly orderMicroservice: ClientProxy,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, token: string) {
    return this.orderMicroservice.send(
      {
        cmd: 'create_order',
      },
      {
        ...createOrderDto,
        token,
      },
    );
  }
}
