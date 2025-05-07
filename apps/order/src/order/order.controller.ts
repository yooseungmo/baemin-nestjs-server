import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateOrderDto } from 'apps/order/src/order/dto/create-order.dto';
import { OrderService } from 'apps/order/src/order/order.service';
import { Authorization } from 'apps/user/src/auth/decorator/authorization.decorator';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createOrder(
    @Authorization() token: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.createOrder(createOrderDto, token);
  }
}
