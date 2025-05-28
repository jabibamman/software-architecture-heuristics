import { Injectable } from '@nestjs/common';
import { UseCaseInterface } from '../../../common/interface/use-case.interface';
import { UserResponseDto } from '../dtos';

@Injectable()
export class GetUserUseCase implements UseCaseInterface {
  constructor() {}

  execute(): Promise<UserResponseDto> {
    throw new Error('Method not implemented.');
  }
}
