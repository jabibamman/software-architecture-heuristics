import { ParseISODatePipe } from '@/common/pipes/parse-iso-date.pipe';
import { SlotDto } from '@/modules/parking/application/dtos/slot.dto';
import { GetSlotsStatusUseCase } from '@/modules/parking/application/use-cases/get-slots-status.use-case';
import { Controller, DefaultValuePipe, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Parking')
@Controller('parking/slots')
export class SlotsController {
  constructor(private readonly getSlotsStatus: GetSlotsStatusUseCase) {}
  @Get()
  @ApiOperation({
    summary:
      'Fetch all parking slots with their reservation status for a given date',
  })
  @ApiResponse({ status: 200, type: [SlotDto] })
  async getAllSlots(
    @Query('date', new DefaultValuePipe(new Date()), ParseISODatePipe)
    date: Date,
  ): Promise<SlotDto[]> {
    return this.getSlotsStatus.execute(date);
  }
}
