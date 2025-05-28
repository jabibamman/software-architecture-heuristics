import { Injectable } from '@nestjs/common';
import { UseCaseInterface } from '../../../common/interface/use-case.interface';
import { LoginDto, TokenResponseDto } from '../dtos';

@Injectable()
export class LoginUseCase implements UseCaseInterface {
  constructor() {}

  execute(dto: LoginDto): Promise<TokenResponseDto> {
    throw new Error('Method not implemented.');
  }
}
