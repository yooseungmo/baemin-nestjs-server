import { RpcInterceptor } from '@app/common';
import { Controller, UseInterceptors } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateOrderDto } from 'apps/order/src/order/dto/create-order.dto';
import { DeliveryStartedDto } from 'apps/order/src/order/dto/delivery-started.dto';
import { OrderStatus } from 'apps/order/src/order/entity/order.entity';
import { OrderService } from 'apps/order/src/order/order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // @Post()
  // @UsePipes(ValidationPipe)
  // async createOrder(
  //   @Authorization() token: string,
  //   @Body() createOrderDto: CreateOrderDto,
  // ) {
  //   return this.orderService.createOrder(createOrderDto, token);
  // }

  @EventPattern({ cmd: 'delivery_started' })
  @UseInterceptors(RpcInterceptor)
  async deliveryStarted(@Payload() payload: DeliveryStartedDto) {
    await this.orderService.changeOrderStatus(
      payload.id,
      OrderStatus.deliveryStarted,
    );
  }

  @MessagePattern({ cmd: 'create_order' })
  async createOrder(@Payload() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }
}
