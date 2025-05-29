import { User } from '@/users/domain/entities/user.entity';

export interface UserRepositoryPort {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}
