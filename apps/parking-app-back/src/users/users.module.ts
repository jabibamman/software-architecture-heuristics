import { Module } from '@nestjs/common';
import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [GetUserUseCase, RegisterUserUseCase],
  exports: [],
})
export class UsersModule {}
