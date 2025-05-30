import { Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UseCaseInterface } from '@/common/interface/use-case.interface';
import { User } from '../../domain/entities/user.entity';
import { UserRepositoryPort } from '../../application/ports/user.repository.port';
import { UserConflictException } from '../../domain/exceptions/user-conflict.exception';
import { LoginDto } from '@/modules/auth/application/dtos';

export class CreateUserUseCase implements UseCaseInterface {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly repo: UserRepositoryPort,
  ) {}

  async execute(dto: LoginDto): Promise<User> {
    const emailExists = await this.repo.findByEmail(dto.email);
    if (emailExists) {
      throw new UserConflictException(dto.email);
    }

    const user = await this.createUserEntity(dto.email, dto.password);
    return await this.repo.save(user);
  }

  async createUserEntity(email: string, password: string): Promise<User> {
    const hashedPassword = await this.hashPassword(password);
    const user = new User();
    user.email = email.toLowerCase();
    user.password = hashedPassword;
    return user;
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
