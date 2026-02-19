import { DateRange } from "../value_objects/data_range";
import { Booking } from "./booking";
import { Property } from "./property";
import { User } from "./user";

describe("Booking Entity", () => {
  it("should create a instance of booking with all attributes", () => {
    const property = new Property("1", "House", "Description", 4, 100);
    const user = new User("1", "John Doe");

    const dateRange = new DateRange(
      new Date("2026-01-01"),
      new Date("2026-01-05"),
    );

    const booking = new Booking("1", property, user, dateRange, 2);

    expect(booking.getId()).toBe("1");
    expect(booking.getProperty()).toBe(property);
    expect(booking.getUser()).toBe(user);
    expect(booking.getDateRange()).toBe(dateRange);
    expect(booking.getGuestCount()).toBe(2);
  });

  it("should throw an error if the number of guests is zero or negative", () => {
    const property = new Property("1", "House", "Description", 5, 150);
    const user = new User("1", "John Doe");

    const dateRange = new DateRange(
      new Date("2026-01-01"),
      new Date("2026-01-05"),
    );

    expect(() => {
      new Booking("1", property, user, dateRange, 0);
    }).toThrow("Number of guests must be greater than 0");
  });

  it("should throw an error when trying to book with more than the maximum number of guests allowed", () => {
    const property = new Property("1", "House", "Description", 4, 150);
    const user = new User("1", "John Doe");

    const dateRange = new DateRange(
      new Date("2026-01-01"),
      new Date("2026-01-05"),
    );

    expect(() => {
      new Booking("1", property, user, dateRange, 5);
    }).toThrow("Maximum number of guest exceeded. Maximum allowed: 4.");
  });

  it("should calculate the total price", () => {
    // Arrange
    const property = new Property("1", "House", "Description", 4, 300);
    const user = new User("1", "John Doe");

    const dateRange = new DateRange(
      new Date("2026-01-01"),
      new Date("2026-01-10"),
    );

    // Act
    const booking = new Booking("1", property, user, dateRange, 4);
    const totalPrice = booking.getTotalPrice();

    // Assert
    expect(totalPrice).toBe(300 * 9 * 0.9);
  });

  it("should not schedule when a property is not available", () => {
    // Arrange
    const property = new Property("1", "House", "Description", 4, 300);
    const user = new User("1", "John Doe");

    const dateRange = new DateRange(
      new Date("2026-01-01"),
      new Date("2026-01-10"),
    );
    const booking = new Booking("1", property, user, dateRange, 4);

    const dateRange2 = new DateRange(
      new Date("2026-01-05"),
      new Date("2026-01-07"),
    );

    expect(() => {
      new Booking("2", property, user, dateRange2, 4);
    }).toThrow("Property is not disponivel for selected period.");
  });

  it("should cancele a booking without refunds when is 1 day before check-in", () => {
    const property = new Property("1", "House", "Description", 4, 300);
    const user = new User("1", "John Doe");

    const dateRange = new DateRange(
      new Date("2026-01-01"),
      new Date("2026-01-03"),
    );

    // Act
    const booking = new Booking("1", property, user, dateRange, 4);

    const currentDate = new Date("2026-01-02");

    booking.cancel(currentDate);

    // Assert
    expect(booking.getStatus()).toBe("CANCELLED");
    expect(booking.getTotalPrice()).toBe(600);
  });

  it("should cancele a booking with full refunds when is more than 7 day before check-in", () => {
    const property = new Property("1", "House", "Description", 4, 300);
    const user = new User("1", "John Doe");

    const dateRange = new DateRange(
      new Date("2026-01-20"),
      new Date("2026-01-25"),
    );

    // Act
    const booking = new Booking("1", property, user, dateRange, 4);

    const currentDate = new Date("2026-01-10");

    booking.cancel(currentDate);

    // Assert
    expect(booking.getStatus()).toBe("CANCELLED");
    expect(booking.getTotalPrice()).toBe(0);
  });

  it("should cancele a booking with partial refunds when is between 1 and 7 day before check-in", () => {
    const property = new Property("1", "House", "Description", 4, 300);
    const user = new User("1", "John Doe");

    const dateRange = new DateRange(
      new Date("2026-01-20"),
      new Date("2026-01-25"),
    );

    // Act
    const booking = new Booking("1", property, user, dateRange, 4);

    const currentDate = new Date("2026-01-15");

    booking.cancel(currentDate);

    // Assert
    expect(booking.getStatus()).toBe("CANCELLED");
    expect(booking.getTotalPrice()).toBe(300 * 5 * 0.5);
  });

  it("should not cancele a booking with the same reversion", () => {
    const property = new Property("1", "House", "Description", 4, 300);
    const user = new User("1", "John Doe");

    const dateRange = new DateRange(
      new Date("2026-01-20"),
      new Date("2026-01-25"),
    );

    // Act
    const booking = new Booking("1", property, user, dateRange, 4);

    const currentDate = new Date("2026-01-15");

    booking.cancel(currentDate);

    expect(() => {
      booking.cancel(currentDate);
    }).toThrow("Booking already cancelled.");

    // Assert
    // expect(booking.getStatus()).toBe("CANCELLED");
    // expect(booking.getTotalPrice()).toBe(300 * 5 * 0.5);
  });
});
