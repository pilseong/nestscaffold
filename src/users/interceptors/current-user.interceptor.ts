import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { UsersService } from './../users.service';

@Injectable()
export default class CurrentUserInterceptor implements NestInterceptor {

  constructor(private usersService: UsersService) { }

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};
    console.log('CurrentUserInterceptor performed')

    // 쿠키의 유저정보
    if (userId) {
      const user = await this.usersService.findOne(userId);
      request.currentUser = user;
    }

    return next.handle();
  }
}