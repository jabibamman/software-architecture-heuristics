import { Module } from '@nestjs/common';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';

@Module({
  imports: [],
  controllers: [],
  providers: [GetUserUseCase, RegisterUserUseCase],
  exports: [],
})
export class UsersModule {}
