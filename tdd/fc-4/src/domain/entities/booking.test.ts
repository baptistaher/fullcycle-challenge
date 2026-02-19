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
});
