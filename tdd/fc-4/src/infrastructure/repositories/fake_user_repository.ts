import { User } from "../../domain/entities/user";
import { UserRepository } from "../../domain/repositories/user_repository";

export class FakeUserRepository implements UserRepository {
    private user: User[] = [
        new User("1", "John Doe"),
        new User("2", "Jane Doe")
    ]

    async findById(id: string): Promise<User | null> {
        return this.user.find(user => user.getId() === id) || null;
    }

    async save(user: User): Promise<void> {
        this.user.push(user);
    }   
}