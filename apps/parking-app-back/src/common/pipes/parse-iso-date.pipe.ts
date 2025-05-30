import { PipeTransform, BadRequestException } from '@nestjs/common';

export class ParseISODatePipe implements PipeTransform<string, Date> {
  transform(value: string): Date {
    const d = new Date(value);
    if (isNaN(d.getTime())) {
      throw new BadRequestException(`Invalid date: ${value}`);
    }
    return d;
  }
}
