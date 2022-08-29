import { ObjectType, Field } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
@ObjectType('address')
export class Address {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId | string;
  @Prop()
  @Field(() => String, { description: 'Street' })
  street: string;
  @Prop()
  @Field(() => String, { description: 'City' })
  city: string;
  @Prop()
  @Field(() => String, { description: 'State address ' })
  state: string;
  @Prop()
  @Field(() => String, { description: 'ZIP address ' })
  zip: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
