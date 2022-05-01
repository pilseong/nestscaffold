import { UsersService } from './users.service';
export default class AuthService {
    private usersService;
    constructor(usersService: UsersService);
    signIn(email: string, password: string): Promise<import("./user.entity").default>;
    signUp(email: string, password: string): Promise<import("./user.entity").default>;
}
