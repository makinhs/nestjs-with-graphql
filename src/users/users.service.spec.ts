import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateUserInput } from './dto/create-user.input';
import * as Chance from 'chance';
import { User, UserSchema } from './entities/user.entity';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../common/helpers/mongoose.helper';
import { ListUsersInput } from './dto/list-users.input';
import { UpdateUserInput } from './dto/update-user.input';

const USER_ROLE = 'User';
const chance = new Chance();
const createUserInput: CreateUserInput = {
  firstName: chance.first(),
  lastName: chance.last(),
  email: chance.email(),
  role: USER_ROLE,
};
let userId = '';

const updateUserInput: UpdateUserInput = {
  _id: userId,
  lastName: chance.last(),
  firstName: chance.first(),
};

describe('UsersService', () => {
  let service: UsersService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          {
            name: User.name,
            schema: UserSchema,
          },
        ]),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
      await closeInMongodConnection();
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an user with createUserInput', async () => {
    const user = await service.create(createUserInput);
    expect(user.id).toBeDefined();
    expect(user.firstName).toBe(createUserInput.firstName);
    expect(user.lastName).toBe(createUserInput.lastName);
    expect(user.email).toBe(createUserInput.email);
    expect(user.role).toBe(createUserInput.role);
    userId = user.id;
  });

  it('should get a list of users', async () => {
    const paginationQuery: ListUsersInput = { offset: 0, limit: 10 };
    const { users, count } = await service.getUsers(paginationQuery);
    expect(users).toBeDefined();
    expect(count).toBeDefined();
    expect(count).toBe(1);
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBe(1);
    expect(users[0].firstName).toBe(createUserInput.firstName);
    expect(users[0].lastName).toBe(createUserInput.lastName);
    expect(users[0].email).toBe(createUserInput.email);
    expect(users[0].role).toBe(createUserInput.role);
  });

  it('should get the user by its own userId', async () => {
    const user = await service.findOne(userId);
    expect(user.id).toBe(userId);
    expect(user.firstName).toBe(createUserInput.firstName);
    expect(user.lastName).toBe(createUserInput.lastName);
    expect(user.email).toBe(createUserInput.email);
    expect(user.role).toBe(createUserInput.role);
  });

  it('should update some user properties', async () => {
    updateUserInput._id = userId;
    const updatedUser = await service.update(
      updateUserInput._id,
      updateUserInput,
    );
    expect(updatedUser.id).toBe(userId);
    expect(updatedUser.firstName).toBe(updateUserInput.firstName);
    expect(updatedUser.firstName).not.toBe(createUserInput.firstName);
    expect(updatedUser.lastName).toBe(updateUserInput.lastName);
    expect(updatedUser.lastName).not.toBe(createUserInput.lastName);
  });

  it('should delete the testing user', async () => {
    const deletedUser = await service.remove(userId);
    expect(deletedUser).toBeDefined();
  });

  it('should receive not found error for getting the deleted user', async () => {
    try {
      await service.findOne(userId);
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.response).toBeDefined();
      expect(err.response.statusCode).toBe(404);
    }
  });

  it('should not be able to update an non existing user', async () => {
    try {
      await service.update(userId, updateUserInput);
    } catch (err) {
      expect(err).toBeDefined();
      expect(err.response).toBeDefined();
      expect(err.response.statusCode).toBe(404);
    }
  });
});
