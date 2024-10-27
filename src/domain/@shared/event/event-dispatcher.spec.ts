import Customer from '../../customer/entity/customer';
import CustomerAddressChangedEvent from '../../customer/event/customer-address-changed.event';
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import LogCustomerNewAddressWhenAddressIsChangedHandler from "../../customer/event/handler/log-customer-new-address-when-address-is-changed.handler";
import Log1WhenCustomerIsCreatedHandler from "../../customer/event/handler/log1-when-customer-is-created.handler";
import Log2WhenCustomerIsCreatedHandler from "../../customer/event/handler/log2-when-customer-is-created.handler";
import Address from "../../customer/value-object/address";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from '../../product/event/product-created.event';
import EventDispatcher from "./event-dispatcher";

describe('Domain event tests', () => {
    it('Should register an event handler', () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register('ProductCreatedEvent', eventHandler);

        expect(eventDispatcher.getEventHandlers['ProductCreatedEvent']).toBeDefined();
        expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'].length).toBe(1);
        expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'][0]).toMatchObject(eventHandler);
    });

    it("Should register customer created event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const firstEventHandler = new Log1WhenCustomerIsCreatedHandler();
        const secondEventHandler = new Log2WhenCustomerIsCreatedHandler();

        eventDispatcher.register("CustomerCreatedEvent", firstEventHandler);
        eventDispatcher.register("CustomerCreatedEvent", secondEventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(firstEventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(secondEventHandler);
    });


    it('Should unregister an event handler', () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register('ProductCreatedEvent', eventHandler);

        expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'][0]).toMatchObject(eventHandler);

        eventDispatcher.unregister('ProductCreatedEvent', eventHandler);

        expect(eventDispatcher.getEventHandlers['ProductCreatedEvent']).toBeDefined();
        expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'].length).toBe(0);
    });

    it("Should unregister customer created event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const firstEventHandler = new Log1WhenCustomerIsCreatedHandler();
        const secondEventHandler = new Log2WhenCustomerIsCreatedHandler();

        eventDispatcher.register("CustomerCreatedEvent", firstEventHandler);
        eventDispatcher.register("CustomerCreatedEvent", secondEventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(firstEventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(secondEventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);

        eventDispatcher.unregister("CustomerCreatedEvent", firstEventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(1);
    });

    it('Should unregister all event handlers', () => {
        const eventDispatcher = new EventDispatcher();
        const SendMaileventHandler = new SendEmailWhenProductIsCreatedHandler();
        const firstLogEventHandler = new Log1WhenCustomerIsCreatedHandler();
        const secondLogEventHandler = new Log2WhenCustomerIsCreatedHandler();

        eventDispatcher.register('ProductCreatedEvent', SendMaileventHandler);
        eventDispatcher.register('CustomerCreatedEvent', firstLogEventHandler);
        eventDispatcher.register('CustomerCreatedEvent', secondLogEventHandler);

        expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'][0]).toMatchObject(SendMaileventHandler);
        expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent'].length).toBe(2);

        eventDispatcher.unregisterAll();

        expect(eventDispatcher.getEventHandlers['ProductCreatedEvent']).toBeUndefined();
        expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent']).toBeUndefined();
    });

    it('Should notify all event handlers', () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, 'handle');

        eventDispatcher.register('ProductCreatedEvent', eventHandler);

        expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'][0]).toMatchObject(eventHandler);

        const productCreatedEvent = new ProductCreatedEvent({
            name: 'Product 1',
            description: 'Product 1 description',
            price: 10.0,
        })

        eventDispatcher.notify(productCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });

    it("Should notify all customer created event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const firstMessageEventHandler = new Log1WhenCustomerIsCreatedHandler();
        const secondMessageEventHandler = new Log2WhenCustomerIsCreatedHandler();

        const firstMessageSpyEventHandler = jest.spyOn(firstMessageEventHandler, "handle");
        const secondMessageSpyEventHandler = jest.spyOn(secondMessageEventHandler, "handle");

        eventDispatcher.register("CustomerCreatedEvent", firstMessageEventHandler);
        eventDispatcher.register("CustomerCreatedEvent", secondMessageEventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(firstMessageEventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(secondMessageEventHandler);

        const customer = new Customer('123', 'Customer 1');
        const customerCreatedEvent = new CustomerCreatedEvent({ customer });

        eventDispatcher.notify(customerCreatedEvent);

        expect(firstMessageSpyEventHandler).toHaveBeenCalled();
        expect(secondMessageSpyEventHandler).toHaveBeenCalled();
    });

    it("Should notify customer address changed event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const firstMessageCustomerCreatedEventHandler = new Log1WhenCustomerIsCreatedHandler();
        const secondMessageCustomerCreatedEventHandler = new Log2WhenCustomerIsCreatedHandler();
        const addressChangedEventHandler = new LogCustomerNewAddressWhenAddressIsChangedHandler();

        const firstMessageCustomerCreatedSpyEventHandler = jest.spyOn(firstMessageCustomerCreatedEventHandler, "handle");
        const secondMessageCustomerCreatedSpyEventHandler = jest.spyOn(secondMessageCustomerCreatedEventHandler, "handle");
        const addressChangedSpyEventHandler = jest.spyOn(addressChangedEventHandler, "handle");

        eventDispatcher.register("CustomerCreatedEvent", firstMessageCustomerCreatedEventHandler);
        eventDispatcher.register("CustomerCreatedEvent", secondMessageCustomerCreatedEventHandler);
        eventDispatcher.register("CustomerAddressChangedEvent", addressChangedEventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(firstMessageCustomerCreatedEventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(secondMessageCustomerCreatedEventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]).toMatchObject(addressChangedEventHandler);

        const customer = new Customer('123', 'Customer 1');
        const customerCreatedEvent = new CustomerCreatedEvent({
            customer
        });
        eventDispatcher.notify(customerCreatedEvent);

        const address = new Address('Rua 1', 2, '12345-678', 'São Paulo');
        customer.changeAddress(address);

        const addressChangedEvent = new CustomerAddressChangedEvent({
            id: customer.id,
            name: customer.name,
            address: customer.address
        });

        eventDispatcher.notify(addressChangedEvent);

        expect(firstMessageCustomerCreatedSpyEventHandler).toHaveBeenCalled();
        expect(secondMessageCustomerCreatedSpyEventHandler).toHaveBeenCalled();
        expect(addressChangedSpyEventHandler).toHaveBeenCalled();
    });

})