import { BadRequestException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import AuthService from "./auth.service";
import User from "./user.entity";
import { UsersService } from "./users.service";

describe("AuthService", () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;

  const users: User[] = [];
  beforeEach(async () => {
    // create a fake copy of the users service
    fakeUserService = {
      find: (email: string) => {
        const filteredUsers = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password
        } as User;
        users.push(user);
        return Promise.resolve(user);
      }
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it("can create an instance of auth service", async () => {
    expect(service).toBeDefined();
  });

  it("creates a new user with a salted and hashed password", async () => {
    let user = await service.signUp("heo@gmail.com", "hasheddata");

    expect(user.password).not.toEqual("hashedata");
    let [salt, hash] = user.password.split("$");
    expect(salt).toBeDefined();
    expect(hash).not.toBeDefined();

    user = await service.signUp("heo2@gmail.com", "hasheddata");
    expect(user.password).not.toEqual("hashedata");
    [salt, hash] = user.password.split(".");
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it("throws an error if user signs up with email that is in use", async () => {
    await service.signUp("heo100@gmail.com", "hasheddata");

    await expect(service.signUp("heo100@gmail.com", "hasheddata"))
      .rejects.toThrow(BadRequestException);
  });

  it('throws NotFoundException if signin is called with an unused email', async () => {
    await expect(service.signIn("heo3@gmail.com", "hasheddata"))
      .rejects.toThrow(NotFoundException);
  })

  it('throws UnauthorizedException if an invalid password is provided', async () => {
    service.signIn("heo@gmail.com", "hasheddata");

    await expect(service.signIn("heo@gmail.com", "hasheddats"))
      .rejects.toThrow(UnauthorizedException);
  })

  it('returns a user if a correct password is provided', async () => {
    await service.signUp("heo4@gmail.com", "test123");

    const user = await service.signIn(
      "heo4@gmail.com",
      "test123");

    expect(user).toBeDefined();

  })
});
