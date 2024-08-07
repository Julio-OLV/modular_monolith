export type AddressProps = {
  street: string;
  number: number;
  city: string;
  state: string;
  zipCode: string;
  complement: string;
};

export default class Address {
  private _street: string;
  private _number: number;
  private _city: string;
  private _state: string;
  private _zipCode: string;
  private _complement: string;

  constructor(props: AddressProps) {
    this._city = props.city;
    this._number = props.number;
    this._state = props.state;
    this._street = props.street;
    this._zipCode = props.zipCode;
    this._complement = props.complement;
  }

  public get city(): string {
    return this._city;
  }

  public get number(): number {
    return this._number;
  }

  public get state(): string {
    return this._state;
  }

  public get street(): string {
    return this._street;
  }

  public get zipCode(): string {
    return this._zipCode;
  }

  public get complement(): string {
    return this._complement;
  }

  public toString(): string {
    return `${this._street}, ${this._number} - ${this._complement}, ${this._state} - ${this._city}, ${this._zipCode}`;
  }
}
