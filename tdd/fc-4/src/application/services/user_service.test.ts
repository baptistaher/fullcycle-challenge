import { User } from "../../domain/entities/user";
import { FakeUserRepository } from "../../infrastructure/repositories/fake_user_repository";
import { UserService } from "./user_service";

describe("UserService", () => {
  let fakeRepository: FakeUserRepository;
  let userService: UserService;

  beforeEach(() => {
    fakeRepository = new FakeUserRepository();
    userService = new UserService(fakeRepository);
  });
  it("should return null when Id invalid is passed", async () => {
    const user = await userService.findUserById("999");
    expect(user).toBeNull();
    // const userService = new UserService();
    // const user = await userService.getUserById("invalid_id");
    // expect(user).toBeNull();
  });

  it("should return user when Id valid is passed", async () => {
    const user = await userService.findUserById("1");

    expect(user).not.toBeNull();
    expect(user?.getId()).toBe("1");
    expect(user?.getName()).toBe("John Doe");
  });

  it("should save a new user with success using fake repository and return again", async () => {
    const newUser = new User("3", "Test User");

    await fakeRepository.save(newUser);
    const user = await userService.findUserById("3");

    expect(user).not.toBeNull();
    expect(user?.getId()).toBe("3");
    expect(user?.getName()).toBe("Test User");
  });
});
