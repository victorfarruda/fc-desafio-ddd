import Address from "../value-object/address";
import CustomerFactory from "./customer.factory";

describe('Customer factory unit test', () => {
  it('Should create a customer', () => {
    const customer = CustomerFactory.create('John');

    expect(customer.id).toBeDefined();
    expect(customer.name).toBe('John');
    expect(customer.address).toBeUndefined();
  })

  it('Should create a customer with an address', () => {
    const address = new Address('Rua 1', 1, '12345-123', 'São Paulo')

    const customer = CustomerFactory.createWithAddress('John', address);

    expect(customer.id).toBeDefined();
    expect(customer.name).toBe('John');
    expect(customer.address).toBe(address);
  })


})