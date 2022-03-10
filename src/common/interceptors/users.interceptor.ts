import { GqlExecutionContext } from '@nestjs/graphql';
import { HttpException, HttpStatus } from '@nestjs/common';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class OnlySameUserByIdAllowed implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const requestUserId =
      req.body?.variables[Object.keys(req.body?.variables)[0]]._id;
    try {
      if (req?.user.userId === requestUserId) {
        return next.handle();
      } else {
        throw new Error('UNAUTHORIZED');
      }
    } catch (err) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }
  }
}
