import type { User } from "../domain/entities/user";
import { UserRepository } from "../domain/repositories/user_repository";

// Fake - Repositorio -> classe fake que simula 
// Mocks 

export class UserService {

  constructor(private readonly userRepository: UserRepository){}

  async findUserById(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }
}
