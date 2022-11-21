import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../../../users/users.service';
import { JwtModule } from '@nestjs/jwt';
import * as Chance from 'chance';
import { User } from '../../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

const chance = new Chance();
const USER_ROLE = 'User';

const user: User = {
  _id: chance.string({ length: 15 }),
  email: chance.email(),
  firstName: chance.first(),
  lastName: chance.last(),
  password: chance.string({ length: 15 }),
  role: USER_ROLE,
  addresses: [
    {
      _id: chance.fbid(),
      street: chance.street(),
      city: chance.city(),
      state: chance.state(),
      zip: chance.zip(),
    },
  ],
};
describe('AuthService', () => {
  let service: AuthService;
  let module: TestingModule;
  const JWT_SECRET = chance.string({ length: 15 });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: JWT_SECRET })],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn(async (email) => {
              if (email) {
                const saltOrRounds = 10;
                const passwordHash = await bcrypt.hash(user.password, saltOrRounds);
                return { ...user, password: passwordHash };
              } else {
                return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate user credentials', async () => {
    const isUserValid = await service.validateUser(user.email, user.password);
    expect(isUserValid).toBeDefined();
    expect(isUserValid.email).toBe(user.email);
  });
  it('should not validate user credentials', async () => {
    const isUserValid = await service.validateUser(null, user.password);
    expect(isUserValid).toBe(null);
  });

  it('should be able to generate an access_token', async () => {
    const { access_token } = await service.generateUserCredentials(user);
    expect(access_token).toBeDefined();
    expect(typeof access_token).toBe('string');
  });
});
