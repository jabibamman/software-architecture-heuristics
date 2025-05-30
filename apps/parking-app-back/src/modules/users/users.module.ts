import { Module } from '@nestjs/common';
import {
  GetUserByEmailUseCase,
  CreateUserUseCase,
  CreateInitialUserUseCase,
} from './application/use-cases';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/user.entity';
import { TypeOrmUserRepository } from '@/modules/users/infrastructure/repositories/typeorm-user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [
    CreateUserUseCase,
    CreateInitialUserUseCase,
    GetUserByEmailUseCase,
    {
      provide: 'UserRepositoryPort',
      useClass: TypeOrmUserRepository,
    },
  ],
  exports: [CreateUserUseCase, GetUserByEmailUseCase, CreateInitialUserUseCase],
})
export class UsersModule {}
