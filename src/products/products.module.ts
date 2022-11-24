import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';

@Module({
  providers: [ProductsResolver, ProductsService],
})
export class ProductsModule {}
