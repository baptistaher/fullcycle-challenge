import { DataSource, Repository } from "typeorm";
import { UserEntity } from "../persistence/entities/user_entity";
import { Property } from "../../domain/entities/property";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { TypeORMPropertyRepository } from "./typeorm_property_repository";

describe("TypeORMPropertyRepository", () => {
  let dataSource: DataSource;
  let propertyRepository: TypeORMPropertyRepository;
  let repository: Repository<PropertyEntity>;
  beforeAll(async () => {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      entities: [UserEntity, PropertyEntity],
      synchronize: true,
      logging: false,
    });
    await dataSource.initialize();
    repository = dataSource.getRepository(PropertyEntity);
    propertyRepository = new TypeORMPropertyRepository(repository);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it("should save new property with success", async () => {
    const property = new Property("1", "House", "A beautiful house", 6, 200);

    await propertyRepository.save(property);

    const savedProperty = await repository.findOne({ where: { id: "1" } });
    expect(savedProperty).not.toBeNull();
    expect(savedProperty?.id).toBe("1");
  });

  it("should return property when Id valid", async () => {
    const property = new Property("1", "House", "A beautiful house", 6, 200);
    
    await propertyRepository.save(property);

    const result = await propertyRepository.findById("1");

    expect(result).not.toBeNull();
    expect(result?.getId()).toBe("1");
    expect(result?.getName()).toBe("House");
    expect(result?.getDescription()).toBe("A beautiful house");
    expect(result?.getMaxGuests()).toBe(6);
    expect(result?.getBasePricePerNight()).toBe(200);
  });

  it("should return null when search property is not found", async ()=>{
    const property = await propertyRepository.findById("2");

    expect(property).toBeNull();
  })
});
