import { UserPayloadDto } from '@app/common';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserPayload } from 'apps/gateway/src/auth/decorator/user-payload.decorator';
import { TokenGuard } from 'apps/gateway/src/auth/guard/token.guard';
import { CreateOrderDto } from 'apps/gateway/src/order/dto/create-order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(TokenGuard)
  async createOrder(
    @UserPayload() userPayloadDto: UserPayloadDto,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.createOrder(createOrderDto, userPayloadDto);
  }
}
