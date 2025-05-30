import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import {
  GenerateTokenUseCase,
  LoginUseCase,
  RegisterUseCase,
} from '@/modules/auth/application/use-cases';
import { JwtPayload, LoginDto } from '@/modules/auth/application/dtos';
import { Role } from '@/modules/users/domain/value-objects/role.value-object';

describe('AuthController', () => {
  let controller: AuthController;

  const loginUseCase = { execute: jest.fn() };
  const registerUseCase = { execute: jest.fn() };
  const generateTokenUseCase = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: LoginUseCase, useValue: loginUseCase },
        { provide: RegisterUseCase, useValue: registerUseCase },
        { provide: GenerateTokenUseCase, useValue: generateTokenUseCase },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should call login use case with dto', async () => {
    const dto: LoginDto = LoginDto.from('john@example.com', 'Password123?');
    await controller.login(dto);
    expect(loginUseCase.execute).toHaveBeenCalledWith(dto);
  });

  it('should call register use case with dto', async () => {
    const dto: LoginDto = LoginDto.from('john@example.com', 'Password123?');
    await controller.register(dto);
    expect(registerUseCase.execute).toHaveBeenCalledWith(dto);
  });

  it('should call generate token use case with user payload', async () => {
    const userPayload = {
      userId: '123',
      email: 'john@example.com',
      role: Role.EMPLOYEE,
    } as JwtPayload;
    await controller.refreshToken(userPayload);
    expect(generateTokenUseCase.execute).toHaveBeenCalledWith(userPayload);
  });
});
