import Address from "../value-object/address";
import Customer from "./customer"

describe("Customer unit tests", () => {
    it("Should throw error when id is empty", () => {
        expect(() => {
            let customer = new Customer("", "João");
        }).toThrowError("Id is required");
    })

    it("Should throw error when name is empty", () => {
        expect(() => {
            let customer = new Customer("123", "");
        }).toThrowError("Name is required");
    })

    it("Should change name", () => {
        const custumer = new Customer("123", "João");
        custumer.changeName("Joana");
        expect(custumer.name).toBe("Joana");
    })

    it("Should activate customer", () => {
        const custumer = new Customer("123", "João");
        const address = new Address("Rua dois", 2, "12345-123", "São Paulo");
        custumer.changeAddress(address);

        custumer.activate();
        
        expect(custumer.isActive()).toBe(true);
    })

    it("Should throw an error when address is undefined", () => {
        expect(()=> {
            const custumer = new Customer("123", "João");
            custumer.activate();
        }).toThrowError("Address is mandatory to active a customer");
    })
    
    it("Should deactivate customer", () => {
        const custumer = new Customer("123", "João");

        custumer.deactivate();
        
        expect(custumer.isActive()).toBe(false);
    })

    it("Should add reward points", () => {
        const customer = new Customer("1", "Customer 1");
        expect(customer.rewardPoints).toBe(0);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20);
    })
})