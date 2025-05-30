import { RegisterUseCase } from '@/modules/auth/application/use-cases';
import { CreateUserUseCase } from '@/modules/users/application/use-cases';
import { GenerateTokenUseCase } from '@/modules/auth/application/use-cases';
import { User } from '@/modules/users/domain/entities/user.entity';
import { LoginDto, JwtPayload } from '@/modules/auth/application/dtos';

describe('RegisterUseCase', () => {
  let registerUseCase: RegisterUseCase;
  let createUserUseCase: jest.Mocked<CreateUserUseCase>;
  let generateTokenUseCase: jest.Mocked<GenerateTokenUseCase>;

  const mockUser: User = Object.assign(new User(), {
    id: 'user-1',
    email: 'new@example.com',
    password: 'hashed-password',
  });

  const dto: LoginDto = {
    email: 'new@example.com',
    password: 'plaintext',
  };

  beforeEach(() => {
    createUserUseCase = { execute: jest.fn() } as any;
    generateTokenUseCase = { execute: jest.fn() } as any;
    registerUseCase = new RegisterUseCase(
      createUserUseCase,
      generateTokenUseCase,
    );
  });

  it('should create user and return access token', async () => {
    createUserUseCase.execute.mockResolvedValue(mockUser);
    generateTokenUseCase.execute.mockResolvedValue({
      accessToken: 'token.jwt.123',
    });

    const result = await registerUseCase.execute(dto);

    expect(createUserUseCase.execute).toHaveBeenCalledWith(dto);
    expect(generateTokenUseCase.execute).toHaveBeenCalledWith(
      JwtPayload.from(mockUser),
    );
    expect(result).toEqual({ accessToken: 'token.jwt.123' });
  });

  it('should throw if user creation fails', async () => {
    createUserUseCase.execute.mockRejectedValue(new Error('Creation failed'));

    await expect(registerUseCase.execute(dto)).rejects.toThrow(
      'Creation failed',
    );
  });

  it('should throw if token generation fails', async () => {
    createUserUseCase.execute.mockResolvedValue(mockUser);
    generateTokenUseCase.execute.mockRejectedValue(new Error('Token error'));

    await expect(registerUseCase.execute(dto)).rejects.toThrow('Token error');
  });
});
