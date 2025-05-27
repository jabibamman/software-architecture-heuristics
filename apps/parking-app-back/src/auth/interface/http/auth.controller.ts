import { Body, Controller, Post } from '@nestjs/common';
import { LoginUseCase } from '../../application/use-cases';
import { LoginDto, TokenResponseDto } from '../../application/dtos';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    // private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<TokenResponseDto> {
    return this.loginUseCase.execute(loginDto);
  }
}
