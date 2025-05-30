import { ConflictException } from '@nestjs/common';

export class UserConflictException extends ConflictException {
  constructor(email: string) {
    super(`Email ${email} already exists`);
  }
}
