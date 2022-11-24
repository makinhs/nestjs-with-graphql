import { Test, TestingModule } from '@nestjs/testing';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';

describe('ProductsResolver', () => {
  let resolver: ProductsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsResolver, ProductsService],
    }).compile();

    resolver = module.get<ProductsResolver>(ProductsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
