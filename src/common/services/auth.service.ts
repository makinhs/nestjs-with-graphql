import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class AuthService {
  private JWT_SECRET = '';

  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtTokenService: JwtService,
    private configService: ConfigService,
  ) {
    this.JWT_SECRET = this.configService.get('JWT_SECRET');
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      if (await argon2.verify(user.password, password)) {
        delete user.password;
        return user;
      }
    }
    return null;
  }

  async loginWithCredentials(user: User) {
    const payload = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      sub: user._id,
    };

    return {
      access_token: this.jwtTokenService.sign(payload, {
        secret: this.JWT_SECRET,
      }),
    };
  }
}
