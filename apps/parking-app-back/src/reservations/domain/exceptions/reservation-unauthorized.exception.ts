import { UnauthorizedException } from '@nestjs/common';

export class ReservationUnauthorizedException extends UnauthorizedException {
  constructor() {
    super(`Not your reservation`);
  }
}
