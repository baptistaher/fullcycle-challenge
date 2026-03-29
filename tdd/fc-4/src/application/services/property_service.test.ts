import { Property } from "../../domain/entities/property";
import { FakePropertyRepository } from "../../infrastructure/repositories/fake_property_repository";
import { PropertyService } from "./property_service";

describe("PropertyService", () => {
  let propertyService: PropertyService;
  let fakePropertyRepository: FakePropertyRepository;

  beforeEach(() => {
    fakePropertyRepository = new FakePropertyRepository();
    propertyService = new PropertyService(fakePropertyRepository);
  });

  it("should return null when Id invalid is passed", async () => {
    const property = await propertyService.findPropertyById("999");
    expect(property).toBeNull();
  });


  it("should return property when Id valid is passed",async()=>{
    const property = await propertyService.findPropertyById("1");

    expect(property).not.toBeNull();
    expect(property?.getId()).toBe("1");
    expect(property?.getName()).toBe("House in the beach");
  })
  it("should save a new propriety with success using fake repository and return again",async()=>{
    const newProperty = new Property("4", "House in the mountain", "beautify house in the mountain", 4, 200);
    await fakePropertyRepository.save(newProperty);
    const property = await propertyService.findPropertyById("4");

    expect(property).not.toBeNull();
    expect(property?.getId()).toBe("4");
    expect(property?.getName()).toBe("House in the mountain");
  })
});
