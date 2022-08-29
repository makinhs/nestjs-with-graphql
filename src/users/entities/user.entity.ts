import { ObjectType, Field } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Address } from './address.entity';

@Schema()
@ObjectType('user')
export class User {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId | string;
  @Prop()
  @Field(() => String, { description: 'User firstName ' })
  firstName: string;
  @Prop()
  @Field(() => String, { description: 'User lastName ' })
  lastName: string;
  @Prop()
  @Field(() => String, { description: 'User email ' })
  email: string;
  @Prop()
  password: string;
  @Prop()
  @Field(() => String, { description: 'User role' })
  role: string;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }] })
  @Field(() => [Address], { description: 'User addresses' })
  addresses: Array<Address>;
}

export const UserSchema = SchemaFactory.createForClass(User);
