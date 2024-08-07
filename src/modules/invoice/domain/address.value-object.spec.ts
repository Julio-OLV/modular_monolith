import Address from "./address.value-object";

describe("AddressValueObject unit test", () => {
  it("should return full address", () => {
    const address = new Address({
      city: "City X",
      complement: "Complement X",
      number: 10,
      state: "State X",
      street: "Street X",
      zipCode: "00000-000",
    });

    expect(address.toString()).toEqual(
      `${address.street}, ${address.number} - ${address.complement}, ${address.state} - ${address.city}, ${address.zipCode}`
    );
  });
});
