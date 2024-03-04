import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerAddressChangeEvent from "../customer-address-change.event";

export default class SendAddressChangeHandler implements EventHandlerInterface<CustomerAddressChangeEvent>{
    handle(event: CustomerAddressChangeEvent): void {
        console.log(`Endereço do cliente: ${event.eventData.id}, ${event.eventData.name} alterado para: ${event.eventData.address}.`)
    }
}
