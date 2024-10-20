import Address from './entity/addres';
import Customer from './entity/customer';
import Order from './entity/order';
import OrderItem from './entity/order_item';

let customer = new Customer("123", "Victor Arruda");
const address = new Address("Rua dois", 2, "12345-123", "São Paulo");
customer.address = address;
customer.activate();

const item1 = new OrderItem("1", "Item1", 10, "p1", 1);
const item2 = new OrderItem("2", "Item2", 10, "p2", 1);
const order = new Order("1", "123", [item1, item2]);