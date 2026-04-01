import { DataSource, Repository } from "typeorm"
import { UserEntity } from "../persistence/entities/user_entity";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { User } from "../../domain/entities/user";
import { DateRange } from "../../domain/value_objects/data_range";
import { Booking } from "../../domain/entities/booking";
import { Property } from "../../domain/entities/property";

describe("TypeORMBookingRepository",()=>{
    let dataSource: DataSource;
    let bookingRepository: TypeORMBookingRepository;
    let repository: Repository<BookingEntity>;


    beforeAll(async()=>{
        dataSource = new DataSource({
            type: "sqlite",
            database: ":memory:",
            dropSchema: true,
            entities: [UserEntity, PropertyEntity, BookingEntity],
            synchronize: true,
            logging: false,
        })

        await dataSource.initialize();
        repository = dataSource.getRepository(BookingEntity);
        bookingRepository = new TypeORMBookingRepository(repository);
    })

    afterAll(async()=>{
        await dataSource.destroy();
    })


    it("should save a booking with success", async()=>{
        const propertyRepository = dataSource.getRepository(PropertyEntity);
        const userProperty = dataSource.getRepository(UserEntity);

        const propertyEntity = propertyRepository.create({
            id: "1",
            name: "House",
            description: "A beautiful house",
            maxGuests: 6,
            basePricePerNight: 200,
        });
        await propertyRepository.save(propertyEntity);

        const property = new Property("1", "House", "A beautiful house", 6, 200);
        // await propertyRepository.ave(property);

        const userEntity = userProperty.create({
            id: "1",
            name: "John Doe",
        });
        await userProperty.save(userEntity);

        const user = new User("1", "John Doe");
        const dateRange = new DateRange(
            new Date("2026-01-01"),
            new Date("2026-01-05"),
        )

        const booking = new Booking("1", property, user, dateRange, 4);
        await bookingRepository.save(booking);

        const savedBooking = await bookingRepository.findById("1");

        expect(savedBooking).not.toBeNull();
        expect(savedBooking?.getId()).toBe("1");
        expect(savedBooking?.getProperty().getId() ).toBe("1");
        expect(savedBooking?.getUser().getId()).toBe("1");
        // expect(savedBooking?.getDateRange()).toBe(dateRange);
        expect(savedBooking?.getGuestCount()).toBe(4);
    })


})