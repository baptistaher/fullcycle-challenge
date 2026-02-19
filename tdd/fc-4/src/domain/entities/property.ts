import type { DateRange } from "../value_objects/data_range";
import type { Booking } from "./booking";

export class Property {
  private readonly id: string;
  private readonly name: string;
  private readonly description: string;
  private readonly maxGuests: number;
  private readonly basePricePerNight: number;

  private readonly bookings: Booking[] = [];
  constructor(
    id: string,
    name: string,
    description: string,
    maxGuests: number,
    basePricePerNight: number,
  ) {
    if (!name) {
      throw new Error("Name is required");
    }

    if (maxGuests <= 0) {
      throw new Error("Max guests must be greater than 0");
    }

    this.id = id;
    this.name = name;
    this.description = description;
    this.maxGuests = maxGuests;
    this.basePricePerNight = basePricePerNight;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getMaxGuests(): number {
    return this.maxGuests;
  }

  getBasePricePerNight(): number {
    return this.basePricePerNight;
  }

  validateGuestCount(guests: number) {
    if (guests > this.maxGuests) {
      throw new Error(
        `Maximum number of guest exceeded. Maximum allowed: ${this.maxGuests}.`,
      );
    }
  }

  calculateTotalPrice(dateRange: DateRange): number {
    const totalNights = dateRange.getTotalNights();

    let totalPrice = this.basePricePerNight * totalNights;

    if (totalNights >= 7) {
      totalPrice *= 0.9;
    }

    return totalPrice;
  }

  isAvailable(dateRange: DateRange): boolean {
    return !this.bookings.some(
      (booking) =>
        booking.getStatus() === "CONFIRMED" &&
        booking.getDateRange().overlaps(dateRange),
    );
  }

  addBooking(booking: Booking) {
    this.bookings.push(booking);
  }

  getBookings(): Booking[] {
    return [...this.bookings];
  }
}
