import { Booking } from "../../domain/entities/booking";
import { CreateBookingDto } from "../dtos/create_booking_dto";
import { FakeBookingRepository } from "../../infrastructure/repositories/fake_booking_repository";
import { BookingService } from "./booking_service";
import { PropertyService } from "./property_service";
import { UserService } from "./user_service";

jest.mock("./property_service");
jest.mock("./user_service");

describe("BookingService", () => {
  let fakeBookingRepository: FakeBookingRepository;
  let bookingService: BookingService;

  let mockPropertyService: jest.Mocked<PropertyService>;
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(() => {
    const mockPropertyRepository = {} as any;
    const mockUserRepository = {} as any;
    mockPropertyService = new PropertyService(
      mockPropertyRepository,
    ) as jest.Mocked<PropertyService>;
    mockUserService = new UserService(
      mockUserRepository,
    ) as jest.Mocked<UserService>;
    fakeBookingRepository = new FakeBookingRepository();
    bookingService = new BookingService(
      fakeBookingRepository,
      mockPropertyService,
      mockUserService,
    );
  });

  it("should create a new booking with fake repository", async () => {
    const mockProperty = {
      getId: jest.fn().mockReturnValue("1"),
      isAvailable: jest.fn().mockReturnValue(true),
      validateGuestCount: jest.fn(),
      calculateTotalPrice: jest.fn().mockReturnValue(500),
      addBooking: jest.fn(),
    } as any;

    const mockUser = {
      getId: jest.fn().mockReturnValue("1"),
    } as any;

    mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
    mockUserService.findUserById.mockResolvedValue(mockUser);

    const bookingDTO: CreateBookingDto = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2025-12-20"),
      endDate: new Date("2025-12-25"),
      guestCount: 2,
    };

    const result = await bookingService.createBooking(bookingDTO);

    expect(result).toBeInstanceOf(Booking);
    expect(result.getStatus()).toBe("CONFIRMED");
    expect(result.getTotalPrice()).toBe(500);

    const savedBooking = await fakeBookingRepository.findById(result.getId());
    expect(savedBooking).not.toBeNull();
    expect(savedBooking?.getId()).toBe(result.getId());
  });

  it("should throw an error if the property is not found", async () => {
    mockPropertyService.findPropertyById.mockResolvedValue(null);

    const bookingDTO: CreateBookingDto = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2025-12-20"),
      endDate: new Date("2025-12-25"),
      guestCount: 2,
    };

    await expect(bookingService.createBooking(bookingDTO)).rejects.toThrow(
      "Property not found",
    );
  

    });

    it("should throw an error if the user is not found ", async () => {
    const mockProperty = {
      getId: jest.fn().mockReturnValue("1"),
    } as any;

    

    mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
    mockUserService.findUserById.mockResolvedValue(null);

    const bookingDTO: CreateBookingDto = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2025-12-20"),
      endDate: new Date("2025-12-25"),
      guestCount: 2,
    };

    await expect(bookingService.createBooking(bookingDTO)).rejects.toThrow(
      "Guest not found",
    );
  });

  it("should throw an error when try to create reservation in period already booked", async () => { 
    const mockProperty = {
      getId: jest.fn().mockReturnValue("1"),
      isAvailable: jest.fn().mockReturnValue(true),
      validateGuestCount: jest.fn(),
      calculateTotalPrice: jest.fn().mockReturnValue(500),
      addBooking: jest.fn(),  
    } as any;

    const mockUser = {
      getId: jest.fn().mockReturnValue("1"),
    } as any;

    mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
    mockUserService.findUserById.mockResolvedValue(mockUser);

    const bookingDTO: CreateBookingDto = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2025-12-20"),
      endDate: new Date("2025-12-25"),
      guestCount: 2,
    };

    const result = await bookingService.createBooking(bookingDTO);


    mockProperty.isAvailable.mockReturnValue(false);
    mockProperty.addBooking.mockImplementationOnce(()=>{
      throw new Error("Property is not disponivel for selected period.")
    })

    await expect(bookingService.createBooking(bookingDTO)).rejects.toThrow(
      "Property is not disponivel for selected period.",
    );

  })

  it("should cancel a existing booking using fake repository",async()=>{
    const mockProperty = {
      getId: jest.fn().mockReturnValue("1"),
      isAvailable: jest.fn().mockReturnValue(true),
      validateGuestCount: jest.fn(),
      calculateTotalPrice: jest.fn().mockReturnValue(500),
      addBooking: jest.fn(),  
    
    }as any;

    const mockUser = {
      getId: jest.fn().mockReturnValue("1"),
    } as any;

    mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
    mockUserService.findUserById.mockResolvedValue(mockUser);


    const bookingDTO: CreateBookingDto = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2025-12-20"),
      endDate: new Date("2025-12-25"),
      guestCount: 2,
    };

    const booking = await bookingService.createBooking(bookingDTO);

    await bookingService.cancelBooking( booking.getId());

    const spyFindById = jest.spyOn(fakeBookingRepository, "findById");


    const canceledBooking = await fakeBookingRepository.findById(booking.getId());
//    expect(canceledBooking).not.toBeNull();
    expect(canceledBooking?.getStatus()).toBe("CANCELLED");
    expect(spyFindById).toHaveBeenCalledWith(booking.getId());
    expect(spyFindById).toHaveBeenCalledTimes(1);
    spyFindById.mockRestore();
  })

  it("should thrown an error if try to cancel a non existing booking",async()=>{
    const bookingId = "invalid-id";

    await expect(bookingService.cancelBooking(bookingId)).rejects.toThrow(
      "Booking not found",
    );
  })
});
