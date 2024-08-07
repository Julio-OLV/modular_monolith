import { v4 as uuid } from "uuid";

import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";

export type InvoiceItemsProps = {
  id?: string;
  name: string;
  price: number;
};

export default class InvoiceItems implements AggregateRoot {
  private _id: string;
  private _name: string;
  private _price: number;

  constructor(props: InvoiceItemsProps) {
    this._id = props.id ?? uuid();
    this._name = props.name;
    this._price = props.price;
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get price(): number {
    return this._price;
  }
}
