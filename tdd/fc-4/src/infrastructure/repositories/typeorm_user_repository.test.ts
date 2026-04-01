import { DataSource, Repository } from "typeorm";
import { User } from "../../domain/entities/user";
import { UserEntity } from "../persistence/entities/user_entity";
import { TypeORMUserRepository } from "./typeorm_user_repository";

describe("TypeORMUserRepository", () => {
    let dataSource: DataSource;
    let userRepository: TypeORMUserRepository;
    let repository: Repository<UserEntity>;
  beforeAll(async () => {

    dataSource = new DataSource({
        type: "sqlite",
        database: ":memory:",
        dropSchema: true,
        entities: [UserEntity],
        synchronize: true,
        logging: false,
    })
    await dataSource.initialize();
    repository = dataSource.getRepository(UserEntity);
    userRepository = new TypeORMUserRepository(repository);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it("should save a user with success", async () => {
    const user = new User("1", "John Doe");

    await userRepository.save(user);

    const savedUser = await repository.findOne({ where: { id: "1" } });

    expect(savedUser).not.toBeNull();
    expect(savedUser?.id).toBe("1");
    expect(savedUser?.name).toBe("John Doe");
  });

  it("should return a user when id is valid ",async()=>{
    const user = new User("1", "Jane Doe");

    await userRepository.save(user);

    const foundUser = await userRepository.findById("1");

    expect(foundUser).not.toBeNull();
    expect(foundUser?.getId()).toBe("1");
    expect(foundUser?.getName()).toBe("Jane Doe");
  })



  it("should return null when the user is no r", async()=>{
    const foundUser = await userRepository.findById("999");

    expect(foundUser).toBeNull();
  });
});
