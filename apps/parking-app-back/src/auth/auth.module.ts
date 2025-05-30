import { Module } from '@nestjs/common';
import { LoginUseCase, GenerateTokenUseCase } from './application/use-cases';
import { AuthController } from './interface/http/auth.controller';
import { UsersModule } from '@/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '5m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [LoginUseCase, GenerateTokenUseCase],
  exports: [JwtModule],
})
export class AuthModule {}
