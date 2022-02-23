import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PageDataDto {
  @Field()
  public count: number;

  @Field()
  public limit: number;

  @Field()
  public offset: number;
}
