import { Module } from '@nestjs/common';
import { AuthController } from './interface/http/auth.controller';
import { LoginUseCase, RefreshTokenUseCase } from './application/use-cases';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [LoginUseCase, RefreshTokenUseCase],
  exports: [],
})
export class AuthModule {}
