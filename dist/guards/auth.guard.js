"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        return request.session.userId;
    }
}
exports.default = AuthGuard;
//# sourceMappingURL=auth.guard.js.map