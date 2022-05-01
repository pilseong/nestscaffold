import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import AuthService from './auth.service';
import CreateUserDto from './dtos/create-user.dto';
import User from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthServie: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) =>
        Promise.resolve({
          id,
          email: "heo@gmail.com",
          password: "hasheddata"
        } as User),
      find: (email: string) =>
        Promise.resolve([
          { id: 1, email, password: "test" } as User
        ]),
      update: () => Promise.resolve(null),
      remove: () => Promise.resolve(null)
    };

    fakeAuthServie = {
      signUp: ((email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User)),
      signIn: ((email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthServie
        },
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
      ],
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('finds all users with the given email', async () => {
    const users = await controller.findAllUsers('heops79@gmail.com', null);
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('heops79@gmail.com');
  });

  it('finds a user with the given id', async () => {
    const user = await controller.findUser("1");
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
  });

  it('throws NotFoundException when there is no user with the given id', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser("1"))
      .rejects.toThrow(NotFoundException);
  });

  it('signs in updates session object and returns user', async () => {
    const session = { userId: "" };
    const user = await controller.signIn(
      { email: "pilseong@gamail.com", password: 'test123' },
      session);

    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
