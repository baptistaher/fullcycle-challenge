import EventHandlerInterface from "../../@shared/event-handler.interface";
import CustomerCreatedEvent from "../customer-created.event";

export class SendEmailWhenCustomerIsCreatedHandler1
  implements EventHandlerInterface<CustomerCreatedEvent>
{
  handle(event: CustomerCreatedEvent): void {
    console.log(`Esse é o primeiro console.log do evento:CustomerCreated`);
    // throw new Error("Method not implemented.");
  }
}
