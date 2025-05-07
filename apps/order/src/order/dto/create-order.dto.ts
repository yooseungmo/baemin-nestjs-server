import { AddressDto } from 'apps/order/src/order/dto/address.dto';
import { PaymentDto } from 'apps/order/src/order/dto/payment.dto';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  productIds: string[];

  @ValidateNested()
  @Type(() => AddressDto)
  @IsNotEmpty()
  address: AddressDto;

  @ValidateNested()
  @Type(() => PaymentDto)
  @IsNotEmpty()
  payment: PaymentDto;
}
