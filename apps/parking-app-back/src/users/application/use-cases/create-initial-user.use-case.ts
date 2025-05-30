import { UseCaseInterface } from '@/common/interface/use-case.interface';
import { User } from '../../domain/entities/user.entity';

import { CreateUserUseCase } from './create-user.use-case';
import { GetUserByEmailUseCase } from './get-user-by-email.use-case';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateInitialUserUseCase implements UseCaseInterface {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findByEmailUseCase: GetUserByEmailUseCase,
  ) {}

  async execute(): Promise<User> {
    const email = process.env.INIT_ADMIN_EMAIL ?? 'prof@example.com';
    const pwd = process.env.INIT_ADMIN_PWD ?? 'Prof123456?';

    let user = await this.findByEmailUseCase.execute(email, {
      throwIfNotFound: false,
    });
    if (user) {
      return user;
    }

    user = await this.createUserUseCase.execute({ email, password: pwd });
    return user;
  }
}
