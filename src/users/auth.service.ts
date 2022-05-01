import {
  BadRequestException, Injectable,
  NotFoundException, UnauthorizedException
} from "@nestjs/common";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export default class AuthService {
  constructor(private usersService: UsersService) { }

  async signIn(email: string, password: string) {
    // find a user from the database
    const [user] = await this.usersService.find(email);
    if (!user)
      throw new NotFoundException('user not found');

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer

    if (storedHash !== hash.toString('hex')) {
      throw new UnauthorizedException('Password not matched');
    }
    return user;
  }

  async signUp(email: string, password: string) {
    // see if email is in use

    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException("Email already taken");
    }

    // Hash the users password
    // generate a salt
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');

    return this.usersService.create(email, result);
  }
}