import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerCreateEvent from "../event/customer-create.event";
import CustomerAddressChangeEvent from "../event/customer-address-change.event";
import SendAddressChangeHandler from "../event/handler/send-address-change-log.handler";
import SendLog1Handler from "../event/handler/send-log1.handler";
import SendLog2Handler from "../event/handler/send-log2.handler";
import Address from "../value-object/address";

export default class Customer {
  private _id: string;
  private _name: string = "";
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;
  private _eventDispatcher: EventDispatcher;
  private static _eventHandler1: SendLog1Handler;
  private static _eventHandler2: SendLog2Handler;
  private static _eventHandlerAddress: SendAddressChangeHandler;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
    this.validate();
    this._eventDispatcher = new EventDispatcher();
    this._eventDispatcher.notify(new CustomerCreateEvent({ id: this._id, name: this._name }));
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  validate() {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._name.length === 0) {
      throw new Error("Name is required");
    }
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  get Address(): Address {
    return this._address;
  }
  
  changeAddress(address: Address) {
    this._address = address;
    this._eventDispatcher.notify(new CustomerAddressChangeEvent({ 
      id: this._id, 
      name: this._name, 
      address: this._address.toString()
      }));
  }

  isActive(): boolean {
    return this._active;
  }

  activate() {
    if (this._address === undefined) {
      throw new Error("Address is mandatory to activate a customer");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }

  set Address(address: Address) {
    this._address = address;
  }

  set eventDispatcher(eventDispatcher: EventDispatcher) {
    this._eventDispatcher = eventDispatcher;
  }

  static getEventHandler1(): SendLog1Handler {
    return Customer._eventHandler1 = new SendLog1Handler();
  }

  static getEventHandler2(): SendLog2Handler {
    return Customer._eventHandler2 = new SendLog2Handler();
  }

  static getEventHandlerAddress(): SendAddressChangeHandler {
    return Customer._eventHandlerAddress = new SendAddressChangeHandler();
  }
}
