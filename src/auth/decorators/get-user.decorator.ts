import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';

export const GetUser = createParamDecorator(
  (data: 'id' | 'email' | 'fullName' | 'roles', ctx: ExecutionContext) => {
    const req: { user: User | undefined } = ctx.switchToHttp().getRequest();
    const user: User | undefined = req.user;

    if (!user) {
      throw new InternalServerErrorException('User not found (request)');
    }
    return data ? user[data] : user;
  },
);
