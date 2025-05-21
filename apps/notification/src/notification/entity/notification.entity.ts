import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum NotificationStatus {
  pending,
  sent,
}

@Schema()
export class Notification extends Document {
  @Prop({
    require: true,
  })
  from: string;

  @Prop({
    require: true,
  })
  to: string;

  @Prop({
    require: true,
  })
  subject: string;

  @Prop({
    require: true,
  })
  content: string;

  @Prop({
    enum: NotificationStatus,
    default: NotificationStatus.pending,
  })
  status: NotificationStatus;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
