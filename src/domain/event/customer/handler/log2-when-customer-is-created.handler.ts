import CustomerCreatedEvent from "../customer-created.event";
import EventHandlerInterface from '../../@shared/event-handler.interface';

export default class Log2WhenCustomerIsCreatedHandler 
implements EventHandlerInterface<CustomerCreatedEvent> {
    handle(event: CustomerCreatedEvent): void {
        console.log('Esse é o segundo console.log do evento: CustomerCreated');
    }   
}