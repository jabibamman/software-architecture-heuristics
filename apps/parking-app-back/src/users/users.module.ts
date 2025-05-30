import { Module } from '@nestjs/common';
import {
  GetUserByEmailUseCase,
  RegisterUserUseCase,
} from './application/use-cases';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/user.entity';
import { TypeOrmUserRepository } from '@/users/infrastructure/repositories/typeorm-user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [
    GetUserByEmailUseCase,
    RegisterUserUseCase,
    {
      provide: 'UserRepositoryPort',
      useClass: TypeOrmUserRepository,
    },
  ],
  exports: [GetUserByEmailUseCase],
})
export class UsersModule {}
