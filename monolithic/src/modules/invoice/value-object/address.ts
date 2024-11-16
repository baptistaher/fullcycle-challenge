import Id from "../../@shared/domain/value-object/id.value-object";

type AddressProps = {
  id?: Id;
  street: string;
  number: string;
  complement: string;
  zip: string;
  city: string;
  state: string;
};

export default class Address {
  private _id: string = "";
  private _street: string = "";
  private _number: string = "";
  private _zip: string = "";
  private _city: string = "";
  private _state: string = "";
  private _complement: string = "";

  constructor(props: AddressProps) {
    this._id = props.id ? props.id.id : new Id().id;
    this._street = props.street;
    this._number = props.number;
    this._zip = props.zip;
    this._city = props.city;
    this._state = props.state;
    this._complement = props.complement;

    this.validate();
  }

  validate() {
    if (this._street.length === 0) {
      throw new Error("Street is required");
    }
    if (this._zip.length === 0) {
      throw new Error("Zip is required");
    }
    if (this._city.length === 0) {
      throw new Error("City is required");
    }
    if (this._state.length === 0) {
      throw new Error("State is required");
    }
  }

  get id(): string {
    return this._id;
  }

  get street(): string {
    return this._street;
  }

  get number(): string {
    return this._number;
  }

  get zip(): string {
    return this._zip;
  }

  get city(): string {
    return this._city;
  }

  get state(): string {
    return this._state;
  }

  get complement(): string {
    return this._complement;
  }
}
