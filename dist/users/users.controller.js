"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../guards/auth.guard");
const serialize_interceptor_1 = require("../interceptors/serialize.interceptor");
const auth_service_1 = require("./auth.service");
const current_user_decorator_1 = require("./decorators/current-user.decorator");
const create_user_dto_1 = require("./dtos/create-user.dto");
const update_user_dto_1 = require("./dtos/update-user-dto");
const user_dto_1 = require("./dtos/user.dto");
const user_entity_1 = require("./user.entity");
const users_service_1 = require("./users.service");
let UsersController = class UsersController {
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
    }
    whoAmI(user) {
        console.log(user);
        return user;
    }
    signOut(session) {
        session.userId = null;
    }
    async createUser(body, session) {
        const user = await this.authService.signUp(body.email, body.password);
        session.userId = user.id;
        return user;
    }
    async signIn(body, session) {
        const user = await this.authService.signIn(body.email, body.password);
        session.userId = user.id;
        return user;
    }
    async findUser(id) {
        console.log("handler is running");
        const user = await this.userService.findOne(parseInt(id));
        if (!user) {
            throw new common_1.NotFoundException("user not found");
        }
        return user;
    }
    async findAllUsers(email, user) {
        console.log("session", user);
        const users = await this.userService.find(email);
        if (!users.length) {
            throw new common_1.NotFoundException("user not found");
        }
        return users;
    }
    updateUser(id, body) {
        return this.userService.update(parseInt(id), body);
    }
    deleteUser(id) {
        return this.userService.remove(parseInt(id));
    }
};
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.default),
    (0, common_1.Get)("/whoami"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.default]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "whoAmI", null);
__decorate([
    (0, common_1.Post)("/signout"),
    __param(0, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "signOut", null);
__decorate([
    (0, common_1.Post)("/signup"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.default, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
__decorate([
    (0, common_1.Post)("/signin"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.default, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "signIn", null);
__decorate([
    (0, common_1.Get)("/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findUser", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("email")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.default]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAllUsers", null);
__decorate([
    (0, common_1.Patch)("/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.default]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)("/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "deleteUser", null);
UsersController = __decorate([
    (0, common_1.Controller)("auth"),
    (0, serialize_interceptor_1.Serialize)(user_dto_1.default),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        auth_service_1.default])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map