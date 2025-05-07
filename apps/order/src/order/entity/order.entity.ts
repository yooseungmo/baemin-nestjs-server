import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Customer,
  CustomerSchema,
} from 'apps/order/src/order/entity/customer.entity';
import {
  DeliveryAddress,
  DeliveryAddressSchema,
} from 'apps/order/src/order/entity/delivery-address.entity';
import {
  Payment,
  PaymentSchema,
} from 'apps/order/src/order/entity/payment.entity';
import {
  Product,
  ProductSchema,
} from 'apps/order/src/order/entity/product.entity';

export enum OrderStatus {
  pending = 'Pending',
  paymentCancelled = 'PaymentCancelled',
  paymentFailed = 'PaymentFailed',
  paymentProcessed = 'PaymentProcessed',
  deliveryStarted = 'DeliveryStarted',
  deliveryDone = 'DeliveryDone',
}

@Schema()
export class Order extends Document {
  @Prop({
    type: CustomerSchema,
    required: true,
  })
  customer: Customer;

  @Prop({
    type: ProductSchema,
    required: true,
  })
  product: Product;

  @Prop({
    type: DeliveryAddressSchema,
    required: true,
  })
  deliveryAddress: DeliveryAddress;

  @Prop({
    enum: OrderStatus,
    default: OrderStatus.pending,
  })
  status: OrderStatus;

  @Prop({
    type: PaymentSchema,
    required: true,
  })
  payment: Payment;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
