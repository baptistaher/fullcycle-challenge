import { Repository } from "typeorm";
import { Property } from "../../domain/entities/property";
import { PropertyRepository } from "../../domain/repositories/property_repository";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { PropertyMapper } from "../persistence/mappers/proptery_mapper";


export class TypeORMPropertyRepository implements PropertyRepository {
    private readonly repository: Repository<PropertyEntity>;


    constructor(repository: Repository<PropertyEntity>) {
        this.repository = repository
    }
   async  save(property: Property): Promise<void> {

        const propertyEntity = PropertyMapper.toPersistence(property);
        await this.repository.save(propertyEntity);

    }
    async findById(id: string): Promise<Property | null> {

        const PropertyEntity = await this.repository.findOne({ where: { id } });

        return PropertyEntity ? PropertyMapper.toDomain(PropertyEntity) : null;
    }
}