import EventHandlerInterface from '../../../@shared/event/event-handler.interface';
import AddressChangedEvent from "../customer-address-changed.event";

export default class LogCustomerNewAddressWhenAddressIsChangedHandler
    implements EventHandlerInterface<AddressChangedEvent> {
    handle(event: AddressChangedEvent): void {
        console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.name} alterado para: ${event.eventData.address}`);
    }
}