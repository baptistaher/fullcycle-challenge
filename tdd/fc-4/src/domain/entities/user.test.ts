import { User } from "./user";
describe("User Entity", () => {
  it("should create a instance of User with ID and Name", () => {
    const user = new User("1", "John Doe");

    expect(user.getId()).toBe("1");
    expect(user.getName()).toBe("John Doe");
  });

  it("should throw an error if name is empty", () => {
    expect(() => new User("1", "")).toThrow("Name is required");
  });

  it("should throw an error if id is empty", () => {
    expect(() => new User("", "John Doe")).toThrow("ID is required");
  });
});
