import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { UserNotFoundException } from '../../domain/exceptions';
import { UserRepositoryPort } from '@/users/application/ports/user.repository.port';

@Injectable()
export class TypeOrmUserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async save(user: User): Promise<User> {
    return this.repo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.repo.findOne({ where: { email } });
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }
}
