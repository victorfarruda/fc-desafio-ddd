import Address from './domain/entity/address';
import Customer from './domain/entity/customer';
import Order from './domain/entity/order';
import OrderItem from './domain/entity/order_item';

let customer = new Customer("123", "Victor Arruda");
const address = new Address("Rua dois", 2, "12345-123", "São Paulo");
customer.changeAddress(address);
customer.activate();

const item1 = new OrderItem("1", "Item1", 10, "p1", 1);
const item2 = new OrderItem("2", "Item2", 10, "p2", 1);
const order = new Order("1", "123", [item1, item2]);