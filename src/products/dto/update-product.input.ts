import { CreateProductInput } from './create-product.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {
  @Field(() => Int)
  id: number;
}
