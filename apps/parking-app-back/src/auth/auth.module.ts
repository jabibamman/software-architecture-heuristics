import { Module } from '@nestjs/common';
import {
  LoginUseCase,
  GenerateTokenUseCase,
  RegisterUseCase,
} from './application/use-cases';
import { AuthController } from './interface/http/auth.controller';
import { UsersModule } from '@/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './infrastructure/jwt/jwt-strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '5m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, LoginUseCase, RegisterUseCase, GenerateTokenUseCase],
  exports: [JwtModule],
})
export class AuthModule {}
