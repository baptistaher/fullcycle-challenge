import EventDispatcher from "../../@shared/event/event-dispatcher";
import Customer from "../entity/customer";
import Address from "../value-object/address";
import CustomerChangeAddressEvent from "./customer-change-address.event";
import CustomerCreatedEvent from "./customer-created.event";
import { SendConsoleLogWhenCustomerChangeAddress } from "./handler/send-console-log-when-customer-change-address";
import { SendEmailWhenCustomerIsCreatedHandler1 } from "./handler/send-email-when-customer-is-created";
import { SendEmailWhenCustomerIsCreatedHandler2 } from "./handler/send-email-when-customer-is-created2";

describe("Customer Event test", () => {
  it("should register an customer event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenCustomerIsCreatedHandler1();
    const eventHandler2 = new SendEmailWhenCustomerIsCreatedHandler2();

    eventDispatcher.register("CustomerCreatedEvent", eventHandler);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length
    ).toBe(2);
  });

  it(" should unregister an customer event handler", () => {
    const consoleSpy = jest.spyOn(console, "log");
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenCustomerIsCreatedHandler1();
    const eventHandler2 = new SendEmailWhenCustomerIsCreatedHandler2();

    eventDispatcher.register("CustomerCreatedEvent", eventHandler);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(eventHandler2);

    eventDispatcher.unregister("CustomerCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length
    ).toBe(1);
  });

  it("should unregister all customer event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenCustomerIsCreatedHandler1();
    const eventHandler2 = new SendEmailWhenCustomerIsCreatedHandler2();

    eventDispatcher.register("CustomerCreatedEvent", eventHandler);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeUndefined();

    // expect();
  });

  it("should notify all customer event handler", () => {
    const eventDispatcher = new EventDispatcher();

    const eventHandler = new SendEmailWhenCustomerIsCreatedHandler1();
    const eventHandler2 = new SendEmailWhenCustomerIsCreatedHandler2();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

    eventDispatcher.register("CustomerCreatedEvent", eventHandler);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length
    ).toBe(2);
    eventDispatcher.register("CustomerCreatedEvent"[0], eventHandler);
    eventDispatcher.register("CustomerCreatedEvent"[1], eventHandler2);

    const customer = new Customer("1", "Customer 1");

    const customerCreatedEvent = new CustomerCreatedEvent(customer);

    eventDispatcher.notify(customerCreatedEvent);
    expect(spyEventHandler).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
  });

  it("should a customer address changed event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendConsoleLogWhenCustomerChangeAddress();

    eventDispatcher.register("CustomerAddressChanged", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerAddressChanged"]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerAddressChanged"].length
    ).toBe(1);
    expect(
      eventDispatcher.getEventHandlers["CustomerAddressChanged"][0]
    ).toMatchObject(eventHandler);
  });

  it("should notify a customer address changed event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenCustomerIsCreatedHandler1();
    const eventHandler2 = new SendEmailWhenCustomerIsCreatedHandler2();

    const addressChangeEventHandler =
      new SendConsoleLogWhenCustomerChangeAddress();

    const spyEventHandler = jest.spyOn(eventHandler, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");
    const spyChangeEventHandler = jest.spyOn(
      addressChangeEventHandler,
      "handle"
    );

    eventDispatcher.register("CustomerCreatedEvent", eventHandler);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
    eventDispatcher.register(
      "CustomerChangeAddressEvent",
      addressChangeEventHandler
    );

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length
    ).toBe(2);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(eventHandler2);

    const customer = new Customer("1", "Customer 1");
    const customerEvent = new CustomerCreatedEvent(customer);
    eventDispatcher.notify(customerEvent);
    expect(spyEventHandler).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();

    const address = new Address("Street 1", 1, "12345-678", "São Paulo");
    customer.changeAddress(address);

    const addressChangedEvent = new CustomerChangeAddressEvent(customer);

    eventDispatcher.notify(addressChangedEvent);

    expect(spyChangeEventHandler).toHaveBeenCalled();
  });
});
