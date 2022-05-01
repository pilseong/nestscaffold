import AuthService from "./auth.service";
import CreateUserDto from "./dtos/create-user.dto";
import UpdateUserDto from "./dtos/update-user-dto";
import User from "./user.entity";
import { UsersService } from "./users.service";
export declare class UsersController {
    private userService;
    private authService;
    constructor(userService: UsersService, authService: AuthService);
    whoAmI(user: User): User;
    signOut(session: any): void;
    createUser(body: CreateUserDto, session: any): Promise<User>;
    signIn(body: CreateUserDto, session: any): Promise<User>;
    findUser(id: string): Promise<User>;
    findAllUsers(email: string, user: User): Promise<User[]>;
    updateUser(id: string, body: UpdateUserDto): Promise<User>;
    deleteUser(id: string): Promise<User>;
}
