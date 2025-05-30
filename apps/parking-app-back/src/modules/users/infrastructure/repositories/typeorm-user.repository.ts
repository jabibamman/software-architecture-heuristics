import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { UserRepositoryPort } from '@/modules/users/application/ports/user.repository.port';

@Injectable()
export class TypeOrmUserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async save(user: User): Promise<User> {
    const entity = this.repo.save(user);
    if (!entity) {
      throw new Error('Failed to save user');
    }
    return entity;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repo.findOne({ where: { email } });
  }
}
