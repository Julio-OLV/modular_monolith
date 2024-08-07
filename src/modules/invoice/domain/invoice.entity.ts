import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "./address.value-object";
import InvoiceItems from "./invoice-items.entity";

export type InvoiceProps = {
  id?: Id;
  name: string;
  document: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export default class Invoice extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _document: string;
  private _address!: Address;
  private _items!: InvoiceItems[];

  constructor(props: InvoiceProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._name = props.name;
    this._document = props.document;
  }

  public get name(): string {
    return this._name;
  }

  public get document(): string {
    return this._document;
  }

  public get address(): Address {
    return this._address;
  }

  public get items(): InvoiceItems[] {
    return this._items;
  }

  public changeAddress(address: Address): void {
    this._address = address;
  }

  public addItemToInvoice(item: InvoiceItems): void {
    if (!this._items?.length) {
      this._items = [item];
    } else {
      this._items.push(item);
    }
  }

  public total(): number {
    return this._items.reduce((acc, item) => acc + item.price, 0);
  }
}
