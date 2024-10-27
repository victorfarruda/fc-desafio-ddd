import AddressChangedEvent from "../customer-address-changed.event";
import EventHandlerInterface from '../../@shared/event-handler.interface';

export default class LogCustomerNewAddressWhenAddressIsChangedHandler
implements EventHandlerInterface<AddressChangedEvent> {
    handle(event: AddressChangedEvent): void {
        console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.name} alterado para: ${event.eventData.address}`);
    }
}