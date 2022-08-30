import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Address } from './entities/address.entity';
import { User } from './entities/user.entity';
import { AddressesFromUserLoader } from './data-loader/addresses-from-user.loader';

@Resolver(() => User)
export class UsersAddressesResolver {
  constructor(private readonly addressesFromUserLoader: AddressesFromUserLoader) {}

  @ResolveField('addresses', () => [Address])
  async getUserAddresses(@Parent() user: User) {
    return this.addressesFromUserLoader.loadMany(user.addresses.toString().split(','));
  }
}
