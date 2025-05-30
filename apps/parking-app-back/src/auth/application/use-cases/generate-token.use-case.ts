import { Injectable } from '@nestjs/common';
import { UseCaseInterface } from '@/common/interface/use-case.interface';
import { TokenResponseDto, JwtPayload } from '../dtos';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GenerateTokenUseCase
  implements UseCaseInterface<JwtPayload, TokenResponseDto>
{
  constructor(private readonly jwtService: JwtService) {}

  async execute(user: JwtPayload): Promise<TokenResponseDto> {
    const token = this.jwtService.sign(user, { expiresIn: '5m' });
    return Promise.resolve(TokenResponseDto.from(token));
  }
}
