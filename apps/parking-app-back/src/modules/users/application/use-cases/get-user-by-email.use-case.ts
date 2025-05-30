import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserNotFoundException } from '../../domain/exceptions';
import { UseCaseInterface } from '@/common/interface/use-case.interface';
import { UserRepositoryPort } from '../../application/ports/user.repository.port';

@Injectable()
export class GetUserByEmailUseCase implements UseCaseInterface {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly repo: UserRepositoryPort,
  ) {}

  async execute(
    email: string,
    options?: { throwIfNotFound?: boolean },
  ): Promise<User | null> {
    const user = await this.repo.findByEmail(email);
    if (!user && options?.throwIfNotFound === true) {
      throw new UserNotFoundException();
    }

    return user;
  }
}
