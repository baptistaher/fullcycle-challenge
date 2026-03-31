import { Booking } from "../../domain/entities/booking";
import { BookingRepository } from "../../domain/repositories/booking_repository";
import { DateRange } from "../../domain/value_objects/data_range";
import { CreateBookingDto } from "../dtos/create_booking_dto";
import { PropertyService } from "./property_service";
import { UserService } from "./user_service";
import {v7 as uuid} from "uuid"



export class BookingService {
    constructor(
        private readonly bookingRepository: BookingRepository,
        private readonly propertyService: PropertyService,
        private readonly userService: UserService
    ){}


    async createBooking(dto: CreateBookingDto): Promise<Booking> {
        const property = await this.propertyService.findPropertyById(dto.propertyId);

        if(!property){
            throw new Error("Property not found");
        }

        const guest = await this.userService.findUserById(dto.guestId);

        if(!guest){
            throw new Error("Guest not found");
        }

        // need to refactor this 
        const dateRange = new DateRange(dto.startDate, dto.endDate); // altamente acoplato precisa de mock

        const booking = new Booking(
        uuid(),
            property,
            guest,
            dateRange,
            dto.guestCount
        );


        await this.bookingRepository.save(booking);
        return booking

       
    }


    async cancelBooking(bookingId: string):Promise<void>{
        const booking = await this.bookingRepository.findById(bookingId);

        booking?.cancel(new Date());
        await this.bookingRepository.save(booking!);
    }
}