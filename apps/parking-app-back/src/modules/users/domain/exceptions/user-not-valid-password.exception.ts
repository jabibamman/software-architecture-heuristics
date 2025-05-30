import { UnauthorizedException } from '@nestjs/common';

export class UserNotValidPasswordException extends UnauthorizedException {
  constructor() {
    super('Wrong password os username');
  }
}
