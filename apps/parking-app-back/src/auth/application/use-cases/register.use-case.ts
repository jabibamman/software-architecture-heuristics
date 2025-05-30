import { Injectable } from '@nestjs/common';
import { LoginDto, JwtPayload, TokenResponseDto } from '../dtos';
import { CreateUserUseCase } from '@/users/application/use-cases';
import { GenerateTokenUseCase } from './generate-token.use-case';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly generateTokenUseCase: GenerateTokenUseCase,
  ) {}

  async execute(dto: LoginDto): Promise<TokenResponseDto> {
    const user = await this.createUserUseCase.execute(dto);
    const payload = JwtPayload.from(user);
    return await this.generateTokenUseCase.execute(payload);
  }
}
