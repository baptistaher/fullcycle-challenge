import Address from "./domain/customer/value-object/address";
import Customer from "./domain/customer/entity/customer";
import Order from "./domain/checkout/entity/order";
import OrderItem from "./domain/checkout/entity/order_item";

let customer = new Customer("123", "Hernani Baptista");
const address = new Address("Rua 1", 1, "12345-678", "São Paulo");
customer.Address = address;
customer.activate();

const item1 = new OrderItem("1", "Item 1", 10, "p1", 2);
const item2 = new OrderItem("2", "Item 2", 20, "p2", 1);
const order = new Order("123", "123", [item1, item2]);
