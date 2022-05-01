import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

// 로그인한 사람만 볼 수 있는 게 필터한다.
export default class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return request.session.userId;
  }
}