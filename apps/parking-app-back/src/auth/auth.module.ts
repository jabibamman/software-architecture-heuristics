import { Module } from '@nestjs/common';
import { AuthController } from './interface/http/auth.controller';
import { LoginUseCase, GenerateTokenUseCase } from './application/use-cases';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [LoginUseCase, GenerateTokenUseCase],
  exports: [],
})
export class AuthModule {}
