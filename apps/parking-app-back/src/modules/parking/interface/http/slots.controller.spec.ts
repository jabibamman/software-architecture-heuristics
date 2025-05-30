import { Test, TestingModule } from '@nestjs/testing';
import { SlotsController } from './slots.controller';
import { GetSlotsStatusUseCase } from '@/modules/parking/application/use-cases/get-slots-status.use-case';
import { SlotDto } from '@/modules/parking/application/dtos/slot.dto';

describe('SlotsController', () => {
  let controller: SlotsController;
  let useCase: jest.Mocked<GetSlotsStatusUseCase>;

  beforeEach(async () => {
    const useCaseMock: Partial<jest.Mocked<GetSlotsStatusUseCase>> = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SlotsController],
      providers: [{ provide: GetSlotsStatusUseCase, useValue: useCaseMock }],
    }).compile();

    controller = module.get<SlotsController>(SlotsController);
    useCase = module.get(GetSlotsStatusUseCase) as any;
  });

  it('should return the slots array from the use-case', async () => {
    const fakeSlots: SlotDto[] = [
      { id: 'A01', reserved: false },
      {
        id: 'A02',
        reserved: true,
        reservationStart: '2025-06-01T08:00:00Z',
        reservationEnd: '2025-06-01T18:00:00Z',
        reservedBy: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      },
    ];
    useCase.execute.mockResolvedValue(fakeSlots);

    const result = await controller.getAllSlots(new Date('2025-06-01'));
    expect(useCase.execute).toHaveBeenCalledWith(new Date('2025-06-01'));
    expect(result).toEqual(fakeSlots);
  });

  it('should propagate errors from the use-case', async () => {
    useCase.execute.mockRejectedValue(new Error('failure'));

    await expect(controller.getAllSlots(new Date())).rejects.toThrow('failure');
    expect(useCase.execute).toHaveBeenCalled();
  });
});
