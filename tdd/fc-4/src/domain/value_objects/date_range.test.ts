import { DateRange } from "./data_range";

describe("DateRange Value Object", () => {
  it("should thrown error if the end date is before the start date", () => {
    expect(() => {
      new DateRange(new Date("2022-01-01"), new Date("2021-01-01"));
    }).toThrow("End date must be after start date");
  });

  it("should create a instance of DateRange with a start date and an end date", () => {
    const startDate = new Date("2022-01-01");
    const endDate = new Date("2022-01-02");
    const dateRange = new DateRange(startDate, endDate);
    expect(dateRange).toBeInstanceOf(DateRange);
    expect(dateRange.getStartDate()).toEqual(startDate);
    expect(dateRange.getEndDate()).toEqual(endDate);
  });

  it("should calculate the total of night correctly", () => {
    const startDate = new Date("2026-01-01");
    const endDate = new Date("2026-01-10");
    const dateRange = new DateRange(startDate, endDate);
    const totalOfNight = dateRange.getTotalNights();
    expect(totalOfNight).toBe(9);
  });

  it("should check if two date ranges overlap", () => {
    const dateRange1 = new DateRange(
      new Date("2026-01-01"),
      new Date("2026-01-10"),
    );
    const dateRange2 = new DateRange(
      new Date("2026-01-05"),
      new Date("2026-01-15"),
    );

    const overlaps = dateRange1.overlaps(dateRange2);
    expect(overlaps).toBe(true);
  });

  it("should throw an error if data ", ()=>{
    const date = new Date("2026-01-01");
    expect(() => {
      new DateRange(date, date);
    }).toThrow("End date cannot be the same as start date");
  })
});
