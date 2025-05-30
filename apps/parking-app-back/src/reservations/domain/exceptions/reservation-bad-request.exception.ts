import { BadRequestException } from '@nestjs/common';

export class ReservationBadRequestException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
