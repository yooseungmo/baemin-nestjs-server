import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'apps/product/src/product/entity/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createSamples() {
    const data = [
      {
        name: '복숭아',
        price: 3000,
        description: '치악산 꿀복숭아 당도최고',
        stock: 2,
      },
      {
        name: '포도',
        price: 2000,
        description: '포도는 맛있어',
        stock: 3,
      },
      {
        name: '귤',
        price: 1000,
        description: '한라봉말고 귤',
        stock: 5,
      },
      {
        name: '바나나',
        price: 500,
        description: '바나나는 근손실 방지에 좋아요',
        stock: 10,
      },
    ];

    await this.productRepository.save(data);

    return true;
  }
}
