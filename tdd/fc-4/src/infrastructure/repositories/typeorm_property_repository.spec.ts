import { DataSource, Repository } from "typeorm";
import { UserEntity } from '../persistence/entities/user_entity';
import { Property } from "../../domain/entities/property";


describe("TypeORMPropertyRepository", () => {
    let dataSource: DataSource;
    let propertyRepository: TypeORMPropertyRepository;
    let repository: Repository<PropertyEntity>;
  beforeAll(async () => {

    dataSource = new DataSource({
        type: "sqlite",
        database: ":memory:",
        dropSchema: true,
        entities: [UserEntity,PropertyEntity],
        synchronize: true,
        logging: false,
    })
    await dataSource.initialize();
    repository = dataSource.getRepository(PropertyEntity);
    propertyRepository = new TypeORMPropertyRepository(repository);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it("should save new property with success", async () => {
    const property = new Property(
        "1",
        "House",
        "A beautiful house",
        6,
        200
    )

    await propertyRepository.save(property);

    const savedProperty = await repository.findOne({where: {id: "1"}});
    expect(savedProperty).not.toBeNull();
    expect(savedProperty?.id).toBe("1");
  });
})