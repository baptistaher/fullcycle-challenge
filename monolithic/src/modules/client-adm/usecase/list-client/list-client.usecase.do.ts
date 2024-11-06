import Address from "../../../@shared/domain/value-object/address";

export interface ListClientInputDto {}

type Client = {
  id: string;
  name: string;
  email: string;
  document: string;
  address: Address;
};

export interface ListClientOutputDto {
  clients: Client[];
}
