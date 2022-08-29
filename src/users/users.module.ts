import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { Address, AddressSchema } from './entities/address.entity';
import { CommonModule } from '../common/common.module';
import { UsersAddressesResolver } from './users-addresses.resolver';

@Module({
  imports: [
    CommonModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Address.name,
        schema: AddressSchema,
      },
    ]),
  ],
  providers: [UsersResolver, UsersService, UsersAddressesResolver],
  exports: [UsersService],
})
export class UsersModule {}
