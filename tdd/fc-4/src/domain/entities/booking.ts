import { FullRefund } from "../cancelation/full_refund";
import { PartialRefund } from "../cancelation/partial_refund";
import { RefundRuleFactory } from "../cancelation/refund_rule_factory";
import type { DateRange } from "../value_objects/data_range";
import type { Property } from "./property";
import type { User } from "./user";

export class Booking {
  private readonly id: string;
  private readonly property: Property;
  private readonly user: User;
  private readonly dateRange: DateRange;
  private readonly guestCount: number;

  private status: "CONFIRMED" | "CANCELLED" = "CONFIRMED";

  private totalPrice: number;

  constructor(
    id: string,
    property: Property,
    user: User,
    dateRange: DateRange,
    guestCount: number,
  ) {
    if (guestCount <= 0) {
      throw new Error("Number of guests must be greater than 0");
    }

    property.validateGuestCount(guestCount);

    if (!property.isAvailable(dateRange)) {
      throw new Error("Property is not disponivel for selected period.");
    }

    this.id = id;
    this.property = property;
    this.user = user;
    this.dateRange = dateRange;
    this.guestCount = guestCount;
    this.totalPrice = property.calculateTotalPrice(dateRange);

    property.addBooking(this);
  }

  getId(): string {
    return this.id;
  }

  getProperty(): Property {
    return this.property;
  }

  getUser(): User {
    return this.user;
  }

  getDateRange(): DateRange {
    return this.dateRange;
  }

  getGuestCount(): number {
    return this.guestCount;
  }

  getStatus(): "CONFIRMED" | "CANCELLED" {
    return this.status;
  }

  getTotalPrice(): number {
    return this.totalPrice;
  }

  cancel(currentDate: Date): void {
    if (this.status === "CANCELLED") {
      throw new Error("Booking already cancelled.");
    }

    const checkIntDate = this.dateRange.getStartDate();
    const timeDiff = checkIntDate.getTime() - currentDate.getTime();
    const daysUntilCheckIn = Math.ceil(timeDiff / (1000 * 3600 * 24));

    const refundRule = RefundRuleFactory.getRefundRule(daysUntilCheckIn);
    this.totalPrice = refundRule.calculateRefund(this.totalPrice);

    this.status = "CANCELLED";
  }
}
