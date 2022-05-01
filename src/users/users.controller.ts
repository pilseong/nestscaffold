import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from "@nestjs/common";
import AuthGuard from "../guards/auth.guard";
import { Serialize } from "../interceptors/serialize.interceptor";
import AuthService from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import CreateUserDto from "./dtos/create-user.dto";
import UpdateUserDto from "./dtos/update-user-dto";
import UserDto from "./dtos/user.dto";
import User from "./user.entity";
import { UsersService } from "./users.service";

@Controller("auth")
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService
  ) { }

  // @Get('/colors/:color')
  // setColor(@Param('color') color: string, @Session() session: any) {
  //   session.color = color;
  // }

  // @Get('/colors')
  // getColor(@Session() session: any) {
  //   return session.color;
  // }

  // @Get('/whoami')
  // whoAmI(@Session() session: any) {
  //   return this.userService.findOne(session.userId);
  // }

  @UseGuards(AuthGuard)
  @Get("/whoami")
  whoAmI(@CurrentUser() user: User) {
    console.log(user);
    return user;
  }

  @Post("/signout")
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Post("/signup")
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signUp(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post("/signin")
  async signIn(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get("/:id")
  async findUser(@Param("id") id: string) {
    console.log("handler is running");
    const user = await this.userService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException("user not found");
    }
    return user;
  }

  @Get()
  async findAllUsers(@Query("email") email: string, @CurrentUser() user: User) {
    console.log("session", user);
    const users = await this.userService.find(email);
    if (!users.length) {
      throw new NotFoundException("user not found");
    }
    return users;
  }

  @Patch("/:id")
  updateUser(@Param("id") id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }

  @Delete("/:id")
  deleteUser(@Param("id") id: string) {
    return this.userService.remove(parseInt(id));
  }
}
