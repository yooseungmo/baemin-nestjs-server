import { ORDER_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { SendPaymentNotificationDto } from 'apps/notification/src/notification/dto/send-payment-notification.dto';
import {
  Notification,
  NotificationStatus,
} from 'apps/notification/src/notification/entity/notification.entity';
import { Model } from 'mongoose';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    @Inject(ORDER_SERVICE)
    private readonly orderService: ClientProxy,
  ) {}

  async sendPaymentNotification(data: SendPaymentNotificationDto) {
    const notification = await this.createNotification(data.to);

    await this.sendEmail();

    await this.updateNotificationStatus(
      notification.id,
      NotificationStatus.sent,
    );

    this.sendDeliveryStartedMessage(data.orderId);

    return this.notificationModel.findById(notification._id);
  }

  sendDeliveryStartedMessage(id: string) {
    this.orderService.emit(
      {
        cmd: 'delivery_started',
      },
      {
        id,
      },
    );
  }

  async updateNotificationStatus(id: string, status: NotificationStatus) {
    return this.notificationModel.findByIdAndUpdate(id, { status });
  }

  // 임시
  async sendEmail() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async createNotification(to: string) {
    return this.notificationModel.create({
      from: 'blanc@gmail.com',
      to: to,
      subject: '배달이 시작되었습니다',
      content: `${to}님! 주문하신 음식 배달이 시작됐습니다.`,
    });
  }
}
