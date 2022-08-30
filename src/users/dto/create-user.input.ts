import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class Address {
  @Field(() => String)
  street: string;
  @Field(() => String)
  city: string;
  @Field(() => String)
  state: string;
  @Field(() => String)
  zip: string;
}

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'first name of the user' })
  firstName: string;
  @Field(() => String, { description: 'last name of the user' })
  lastName: string;
  @Field(() => String, { description: 'email of the user' })
  email: string;
  @Field(() => String, { description: 'role of the user' })
  role: string;
  @Field(() => String, { description: 'password of the user' })
  password: string;
  @Field(() => [Address])
  addresses: Array<Address>;
}
