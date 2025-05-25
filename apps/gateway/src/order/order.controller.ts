import { Body, Controller, Post } from '@nestjs/common';
import { Authorization } from 'apps/gateway/src/auth/decorator/authorization.decorator';
import { CreateOrderDto } from 'apps/gateway/src/order/dto/create-order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @Authorization() token: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.createOrder(createOrderDto, token);
  }
}
