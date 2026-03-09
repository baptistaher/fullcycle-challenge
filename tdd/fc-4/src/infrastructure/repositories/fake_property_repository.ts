import { Property } from "../../domain/entities/property";
import { PropertyRepository } from "../../domain/repositories/property_repository";

export class FakePropertyRepository implements PropertyRepository {
  private properties: Property[] = [
    new Property(
      "1",
      "House in the beach",
      "beautify house in the beach",
      4,
      200,
    ),
    new Property(
      "2",
      "House in the mountain",
      "beautify house in the mountain",
      4,
      200,
    ),
  ];

  async save(property: Property): Promise<void> {
    this.properties.push(property);
  }
  async findById(id: string): Promise<Property | null> {
    return this.properties.find((property) => property.getId() === id) || null;
  }
}
