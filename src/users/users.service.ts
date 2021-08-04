import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  create(createUserInput: CreateUserInput): User {
    return { exampleField: createUserInput.exampleField };
  }

  findAll(): [User] {
    return [{ exampleField: 1 }];
  }

  findOne(id: number): User {
    return { exampleField: id };
  }

  update(id: number, updateUserInput: UpdateUserInput): User {
    return { exampleField: updateUserInput.id };
  }

  remove(id: number): User {
    return { exampleField: id };
  }
}
