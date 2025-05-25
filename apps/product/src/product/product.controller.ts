import { RpcInterceptor } from '@app/common/interceptor/rpc.interceptor';
import {
  Controller,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetProductsInfo } from 'apps/product/src/product/dto/get-products-info.dto';
import { ProductService } from 'apps/product/src/product/product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern({
    cmd: 'create_samples',
  })
  @UsePipes(ValidationPipe)
  @UseInterceptors(RpcInterceptor)
  createSamples() {
    return this.productService.createSamples();
  }

  @MessagePattern({ cmd: 'get_products_info' })
  @UsePipes(ValidationPipe)
  @UseInterceptors(RpcInterceptor)
  getProductsInfo(@Payload() data: GetProductsInfo) {
    return this.productService.getProductsInfo(data.productIds);
  }
}
