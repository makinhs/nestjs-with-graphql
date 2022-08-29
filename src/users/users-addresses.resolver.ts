import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Address } from './entities/address.entity';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';

@Resolver(() => User)
export class UsersAddressesResolver {
  constructor(
    @InjectModel(Address.name)
    private readonly addressModel: Model<Address>,
  ) {}

  @ResolveField('addresses', () => [Address])
  async getUserAddresses(@Parent() user: User) {
    const addresses = await this.addressModel
      .find({
        _id: { $in: user.addresses },
      })
      .exec();
    return addresses;
  }
}
