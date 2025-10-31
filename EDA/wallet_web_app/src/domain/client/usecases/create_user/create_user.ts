import { ApiService } from '@/infra/http/api-services';

type CreateClientInputDTO = {
  name: string;
  email: string;
};

type CreateClientOutputDTO = {
  id: string;
  name: string;
  email: string;
};

export const createUser = async (
  data: CreateClientInputDTO
): Promise<CreateClientOutputDTO> => {
  const api = new ApiService();

  const response = await api.post<CreateClientOutputDTO>('/users', data);

  if (response.status !== 201) {
    throw new Error('Failed to create user');
  }

  return response.data;
};
