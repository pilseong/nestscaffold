import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
export default class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}
