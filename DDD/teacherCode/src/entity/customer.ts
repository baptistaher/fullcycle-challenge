import Address from "./address";

export default class Customer {
  private _id: string;
  private _name: string = "";
  private _address!: Address;
  private _active = true;

  // constructor(id: string) {
  //   this._id = id;
  // }

  // constructor(id: string, name: string, address: string) {
  //   this._id = id;
  //   this._name = name;
  //   this._address = address;
  // }

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
    this.validate();
  }

  validate() {
    if (this._name.length === 0) {
      throw new Error("Name is required");
    }
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    // if (this._address.length === 0) {
    //   throw new Error("Address is required");
    // }
  }

  get name(): string {
    return this._name;
  }

  isActive(): boolean {
    return this._active;
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  set Address(address: Address) {
    this._address = address;
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
}
