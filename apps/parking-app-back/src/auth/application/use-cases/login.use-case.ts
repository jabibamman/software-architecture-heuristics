import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UseCaseInterface } from '@/common/interface/use-case.interface';
import { LoginDto, TokenResponseDto } from '../dtos';
import { UserNotFoundException } from '@/users/domain/exceptions/user-not-found.exception';
import { GetUserByEmailUseCase } from '@/users/application/use-cases/get-user-by-email-use-case.service';
import { JwtService } from '@nestjs/jwt';
import { UserNotValidPasswordException } from '@/users/domain/exceptions/user-not-valid-password.exception';

@Injectable()
export class LoginUseCase implements UseCaseInterface {
  constructor(
    private readonly findByEmail: GetUserByEmailUseCase,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginDto): Promise<TokenResponseDto> {
    const { email, password } = dto;

    const user = await this.findByEmail.execute(email);
    if (!user) {
      throw new UserNotFoundException();
    }

    const isValidPassword = await this.validatePassword(
      user.password,
      password,
    );
    if (!isValidPassword) {
      throw new UserNotValidPasswordException();
    }

    const finalToken = this.jwtService.sign({
      userId: user.id,
      email: user.email,
    });

    return TokenResponseDto.from(finalToken);
  }

  async validatePassword(
    userPassword: string,
    plainPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, userPassword);
  }
}
