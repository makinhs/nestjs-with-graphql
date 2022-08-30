import { Injectable, Scope } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { Address } from '../entities/address.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable({ scope: Scope.REQUEST })
export class AddressesFromUserLoader extends DataLoader<string, Address> {
  constructor(
    @InjectModel(Address.name)
    private readonly addressModel: Model<Address>,
  ) {
    super((keys) => this.batchLoad(keys));
  }

  private async batchLoad(userAddresses: readonly string[]): Promise<ArrayLike<Address>> {
    const addresses = await this.addressModel
      .find({
        _id: { $in: userAddresses },
      })
      .exec();

    const parsedResults = [];
    for (let i = 0; i < userAddresses.length; i++) {
      const addressesId = userAddresses[i];
      parsedResults.push(addresses.find(({ id }) => id === addressesId));
    }
    return parsedResults;
  }
}
