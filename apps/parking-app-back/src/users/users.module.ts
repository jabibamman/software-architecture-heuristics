import { Module } from '@nestjs/common';
import { GetUserByEmailUseCase } from './application/use-cases/get-user-by-email-use-case.service';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [GetUserByEmailUseCase, RegisterUserUseCase],
  exports: [],
})
export class UsersModule {}
