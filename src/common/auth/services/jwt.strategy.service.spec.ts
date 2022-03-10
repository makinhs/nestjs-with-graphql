import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import * as Chance from 'chance';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy.service';

const chance = new Chance();
const USER_ROLE = 'User';

const userPayload = {
  sub: chance.string({ length: 15 }),
  email: chance.email(),
  firstName: chance.first(),
  lastName: chance.last(),
  role: USER_ROLE,
};
describe('JwtStrategyService', () => {
  let service: JwtStrategy;
  let module: TestingModule;
  const JWT_SECRET = chance.string({ length: 15 });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: JWT_SECRET })],
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => {
              return chance.string({ length: 15 });
            }),
          },
        },
      ],
    }).compile();

    service = module.get<JwtStrategy>(JwtStrategy);
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an object with userId and payload', async () => {
    const user = await service.validate(userPayload);
    expect(user.userId).toBe(userPayload.sub);
  });
});
