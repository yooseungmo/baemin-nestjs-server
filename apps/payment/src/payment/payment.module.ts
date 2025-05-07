import { Module } from '@nestjs/common';
import { PaymentService } from 'apps/payment/src/payment/payment.service';
import { PaymentController } from './payment.controller';

@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
