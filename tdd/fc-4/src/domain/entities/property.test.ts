import { DateRange } from "../value_objects/data_range";
import { Booking } from "./booking";
import { Property } from "./property";
import { User } from "./user";

describe("Property Entity", () => {
  it("should create a instance of property with all attributes", () => {
    const property = new Property(
      "1",
      "House in the beach",
      "beautify house in the beach",
      4,
      200,
    );

    expect(property.getId()).toBe("1");
    expect(property.getName()).toBe("House in the beach");
    expect(property.getDescription()).toBe("beautify house in the beach");
    expect(property.getMaxGuests()).toBe(4);
    expect(property.getBasePricePerNight()).toBe(200);
  });

  it("should throw an error if name is empty", () => {
    expect(
      () => new Property("1", "", "beautify house in the beach", 4, 200),
    ).toThrow("Name is required");
  });

  it("should throw an error if maxGuests is less than 0 or negative", () => {
    expect(
      () =>
        new Property(
          "1",
          "House in the beach",
          "beautify house in the beach",
          0,
          200,
        ),
    ).toThrow("Max guests must be greater than 0");
  });

  it("should validate the max of guest", () => {
    const property = new Property(
      "1",
      "House in the beach",
      "beautify house in the beach",
      5,
      150,
    );

    expect(() => property.validateGuestCount(6)).toThrow(
      "Maximum number of guest exceeded. Maximum allowed: 5.",
    );
  });

  it("discounts should not apply for stays shorter than 7 nights", () => {
    const property = new Property(
      "1",
      "House in the beach",
      "beautify house in the beach",
      5,
      100,
    );
    const dateRange = new DateRange(
      new Date("2026-01-01"),
      new Date("2026-01-07"),
    );

    const totalPrice = property.calculateTotalPrice(dateRange);
    expect(totalPrice).toBe(600);
  });

  it("discounts should  apply for stays longer than 7 nights", () => {
    const property = new Property(
      "1",
      "House in the beach",
      "beautify house in the beach",
      5,
      100,
    );
    const dateRange = new DateRange(
      new Date("2026-01-01"),
      new Date("2026-01-08"),
    );

    const totalPrice = property.calculateTotalPrice(dateRange);
    expect(totalPrice).toBe(630);
  });

  it("should verify property availability", () => {
    const property = new Property(
      "1",
      "House in the beach",
      "beautify house in the beach",
      5,
      100,
    );

    const user = new User("1", "John Doe");

    const dateRange = new DateRange(
      new Date("2026-01-01"),
      new Date("2026-01-08"),
    );

    const dateRange2 = new DateRange(
      new Date("2026-01-05"),
      new Date("2026-01-07"),
    );

    new Booking("1", property, user, dateRange, 2);

    expect(property.isAvailable(dateRange)).toBe(false);

    expect(property.isAvailable(dateRange2)).toBe(false);
  });
});
