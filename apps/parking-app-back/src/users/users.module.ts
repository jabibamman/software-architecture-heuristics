import { Module } from '@nestjs/common';
import {
  GetUserByEmailUseCase,
  CreateUserUseCase,
} from './application/use-cases';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/user.entity';
import { TypeOrmUserRepository } from '@/users/infrastructure/repositories/typeorm-user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [
    CreateUserUseCase,
    GetUserByEmailUseCase,
    CreateUserUseCase,
    {
      provide: 'UserRepositoryPort',
      useClass: TypeOrmUserRepository,
    },
  ],
  exports: [CreateUserUseCase, GetUserByEmailUseCase],
})
export class UsersModule {}
