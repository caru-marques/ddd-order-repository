import EventDispatcher from "../../@shared/event/event-dispatcher";
import SendLog1Handler from "../event/handler/send-log1.handler";
import SendLog2Handler from "../event/handler/send-log2.handler";
import Address from "../value-object/address";
import Customer from "./customer";
import SendAddressChangeHandler from "../event/handler/send-address-change-log.handler";
import CustomerCreateEvent from "../event/customer-create.event";
import CustomerAddressChangeEvent from "../event/customer-address-change.event";

describe("Customer unit tests", () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should throw error when id is empty", () => {
    expect(() => {
      let customer = new Customer("", "John");
    }).toThrowError("Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      let customer = new Customer("123", "");
    }).toThrowError("Name is required");
  });

  it("should change name", () => {
    // Arrange
    const customer = new Customer("123", "John");

    // Act
    customer.changeName("Jane");

    // Assert
    expect(customer.name).toBe("Jane");
  });

  it("should activate customer", () => {
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    customer.Address = address;

    customer.activate();

    expect(customer.isActive()).toBe(true);
  });

  it("should throw error when address is undefined when you activate a customer", () => {
    expect(() => {
      const customer = new Customer("1", "Customer 1");
      customer.activate();
    }).toThrowError("Address is mandatory to activate a customer");
  });

  it("should deactivate customer", () => {
    const customer = new Customer("1", "Customer 1");

    customer.deactivate();

    expect(customer.isActive()).toBe(false);
  });

  it("should add reward points", () => {
    const customer = new Customer("1", "Customer 1");
    expect(customer.rewardPoints).toBe(0);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(10);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(20);
  });

  it("Should send log event when customer is created", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandlerLog1 = new SendLog1Handler();
    const eventHandlerLog2 = new SendLog2Handler();
    const spyEventHandlerLog1 = jest.spyOn(eventHandlerLog1, "handle");
    const spyEventHandlerLog2 = jest.spyOn(eventHandlerLog2, "handle");
  
    eventDispatcher.register(CustomerCreateEvent.name, eventHandlerLog1);
    eventDispatcher.register(CustomerCreateEvent.name, eventHandlerLog2);
  
    const customer = new Customer("1", "Customer 1");
  
    eventDispatcher.notify(new CustomerCreateEvent({ id: customer.id, name: customer.name }));
  
    expect(spyEventHandlerLog1).toHaveBeenCalled();
    expect(spyEventHandlerLog2).toHaveBeenCalled();
  });
  
  it("Should send log event when customer's address changes", () => {
    const mockEventDispatcher = new EventDispatcher();
    const spyNotify = jest.spyOn(mockEventDispatcher, "notify");

    const eventHandlerLog = new SendAddressChangeHandler();
    mockEventDispatcher.register(CustomerAddressChangeEvent.name, eventHandlerLog);
  
    const customer = new Customer("1", "Customer 1");
    customer.eventDispatcher = mockEventDispatcher;
  
    const address = new Address("Street", 123, "12345-678", "City");
    customer.changeAddress(address);
  
    expect(spyNotify).toHaveBeenCalledWith(expect.any(CustomerAddressChangeEvent));
  });
  

});
