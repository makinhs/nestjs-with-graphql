import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../../users/users.service';
import { User } from '../../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtTokenService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        delete user.password;
        return user;
      }
    }
    return null;
  }

  async generateUserCredentials(user: User) {
    const payload = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      sub: user._id,
    };

    return {
      access_token: this.jwtTokenService.sign(payload),
    };
  }
}
