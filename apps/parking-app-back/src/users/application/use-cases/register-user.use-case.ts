import { Injectable } from '@nestjs/common';
import { UseCaseInterface } from '../../../common/interface/use-case.interface';
import { CreateUserDto, UserResponseDto } from '../dtos';

@Injectable()
export class RegisterUserUseCase implements UseCaseInterface {
  constructor() {}

  execute(dto: CreateUserDto): Promise<UserResponseDto> {
    throw new Error('Method not implemented.');
  }
}
