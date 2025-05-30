import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  LoginUseCase,
  GenerateTokenUseCase,
} from '../../application/use-cases';
import { LoginDto, TokenResponseDto } from '../../application/dtos';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { JwtPayload } from '@/auth/application/dtos/JwtPayload';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly generateTokenUseCase: GenerateTokenUseCase,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<TokenResponseDto> {
    return await this.loginUseCase.execute(loginDto);
  }

  @Get('refresh-token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async refreshToken(
    @CurrentUser() user: JwtPayload,
  ): Promise<TokenResponseDto> {
    return await this.generateTokenUseCase.execute(user);
  }
}
