import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UseCaseInterface } from '@/common/interface/use-case.interface';
import { LoginDto, TokenResponseDto, JwtPayload } from '../dtos';
import { GetUserByEmailUseCase } from '@/modules/users/application/use-cases';
import {
  UserNotFoundException,
  UserNotValidPasswordException,
} from '@/modules/users/domain/exceptions';
import { GenerateTokenUseCase } from './generate-token.use-case';

@Injectable()
export class LoginUseCase
  implements UseCaseInterface<LoginDto, TokenResponseDto>
{
  constructor(
    private readonly findByEmail: GetUserByEmailUseCase,
    private readonly generateTokenUseCase: GenerateTokenUseCase,
  ) {}

  async execute(dto: LoginDto): Promise<TokenResponseDto> {
    const { email, password } = dto;

    const user = await this.findByEmail.execute(email, {
      throwIfNotFound: true,
    });

    const isValidPassword = await this.validatePassword(
      user!.password,
      password,
    );
    if (!isValidPassword) {
      throw new UserNotValidPasswordException();
    }

    const payload = JwtPayload.from(user!);
    return await this.generateTokenUseCase.execute(payload);
  }

  validatePassword(
    userPassword: string,
    plainPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, userPassword);
  }
}
