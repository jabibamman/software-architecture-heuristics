import { Injectable } from '@nestjs/common';
import { UseCaseInterface } from '../../../common/interface/use-case.interface';
import { TokenResponseDto } from '../dtos';

@Injectable()
export class RefreshTokenUseCase implements UseCaseInterface {
  constructor() {}

  execute(): Promise<TokenResponseDto> {
    throw new Error('Method not implemented.');
  }
}
