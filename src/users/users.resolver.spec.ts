import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import * as Chance from 'chance';
import { CreateUserInput } from './dto/create-user.input';
import * as mongoose from 'mongoose';
import { ListUsersInput } from './dto/list-users.input';
import { UpdateUserInput } from './dto/update-user.input';
import { LoginUserInput } from './dto/login-user.input';

const USER_ROLE = 'User';
const chance = new Chance();
const createUserInput: CreateUserInput = {
  firstName: chance.first(),
  lastName: chance.last(),
  email: chance.email(),
  password: chance.string({ length: 15 }),
  role: USER_ROLE,
  addresses: [
    {
      street: chance.street(),
      city: chance.city(),
      state: chance.state(),
      zip: chance.zip(),
    },
  ],
};
const userId = new mongoose.Types.ObjectId();
const updateUserInput: UpdateUserInput = {
  _id: userId.toString(),
  lastName: chance.last(),
  firstName: chance.first(),
};

describe('UsersResolver', () => {
  let resolver: UsersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(() => {
              return {
                _id: userId,
                ...createUserInput,
              };
            }),
            findAll: jest.fn(() => {
              return [
                {
                  _id: userId,
                  ...createUserInput,
                },
              ];
            }),
            getUsers: jest.fn(() => {
              return {
                users: [
                  {
                    _id: userId,
                    ...createUserInput,
                  },
                ],
                count: 1,
              };
            }),
            findOne: jest.fn(() => {
              return {
                _id: userId,
                ...createUserInput,
              };
            }),
            update: jest.fn(() => {
              return {
                _id: userId,
                ...createUserInput,
                ...updateUserInput,
              };
            }),
            remove: jest.fn(() => {
              return {};
            }),
            loginUser: jest.fn(() => {
              return { access_token: '' };
            }),
          },
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should be able to create an user', async () => {
    const user = await resolver.createUser(createUserInput);
    expect(user._id).toBeDefined();
    expect(user._id).toBe(userId);
    expect(user.firstName).toBe(createUserInput.firstName);
    expect(user.lastName).toBe(createUserInput.lastName);
    expect(user.email).toBe(createUserInput.email);
    expect(user.role).toBe(createUserInput.role);
  });
  it('should be able to list all users', async () => {
    const listUserInput: ListUsersInput = { limit: 10, offset: 0 };
    const users = await resolver.findAll(listUserInput);
    expect(users).toBeDefined();
    expect(Array.isArray(users)).toBe(true);
    expect(users[0]._id).toBe(userId);
  });
  it('should be able to list users with cursor', async () => {
    const findAllArgs = { first: 2 };
    const usersWithCursor = await resolver.findAllWithCursor(findAllArgs);
    expect(usersWithCursor.page.edges).toBeDefined();
    expect(usersWithCursor.page.edges[0].node).toBeDefined();
    expect(usersWithCursor.page.edges[0].node.firstName).toBe(createUserInput.firstName);
  });
  it('should be able to find one user by id', async () => {
    const user = await resolver.findOne(userId.toString());
    expect(user).toBeDefined();
    expect(user._id).toBe(userId);
  });
  it('should be able to test updateUser ', async () => {
    const updatedUser = await resolver.updateUser(updateUserInput);
    expect(updatedUser).toBeDefined();
    expect(updatedUser.firstName).toBe(updateUserInput.firstName);
    expect(updatedUser.lastName).toBe(updateUserInput.lastName);
  });

  it('should be able generate an access token', async () => {
    const loginUserInput: LoginUserInput = {
      email: createUserInput.email,
      password: createUserInput.password,
    };
    const { access_token } = await resolver.loginUser(loginUserInput);
    expect(access_token).toBeDefined();
  });

  it('should be able to test removeUser ', async () => {
    const removedUser = await resolver.removeUser(userId.toString());
    expect(removedUser).toBeDefined();
  });
});
