import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Address } from './entities/address.entity';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ListUsersInput } from './dto/list-users.input';
import { LoginUserInput } from './dto/login-user.input';
import { AuthService } from '../common/auth/services/auth.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Address.name)
    private readonly addressModel: Model<Address>,
    private readonly authService: AuthService,
  ) {}

  async create(createUserInput: CreateUserInput) {
    const saltOrRounds = 10;
    const password = createUserInput.password;
    createUserInput.password = await bcrypt.hash(password, saltOrRounds);
    let addresses = [];
    createUserInput.addresses.forEach((address) => {
      addresses.push(new this.addressModel(address).save());
    });
    addresses = await Promise.all(addresses);
    const user = new this.userModel({ ...createUserInput, addresses });
    return user.save();
  }

  findAll(paginationQuery: ListUsersInput) {
    const { limit, offset } = paginationQuery;
    return this.userModel.find().skip(offset).limit(limit).exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findOne({ _id: id }).exec();
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    const existingUser = await this.userModel.findOneAndUpdate({ _id: id }, { $set: updateUserInput }, { new: true }).exec();

    if (!existingUser) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return existingUser;
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return user.remove();
  }

  async getUsers(paginationQuery: ListUsersInput) {
    const count = await this.userModel.count();
    const users = await this.findAll(paginationQuery);
    return { users, count };
  }

  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email: email }).exec();
    if (!user) {
      throw new NotFoundException(`User ${email} not found`);
    }
    return user;
  }

  async loginUser(loginUserInput: LoginUserInput) {
    const user = await this.authService.validateUser(loginUserInput.email, loginUserInput.password);
    if (!user) {
      throw new BadRequestException(`Email or password are invalid`);
    } else {
      return this.authService.generateUserCredentials(user);
    }
  }
}
