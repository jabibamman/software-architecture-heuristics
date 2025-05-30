import { LoginUseCase } from '@/modules/auth/application/use-cases';
import { GetUserByEmailUseCase } from '@/modules/users/application/use-cases';
import { GenerateTokenUseCase } from '@/modules/auth/application/use-cases';
import { User } from '@/modules/users/domain/entities/user.entity';
import * as bcrypt from 'bcrypt';
import {
  UserNotFoundException,
  UserNotValidPasswordException,
} from '@/modules/users/domain/exceptions';

jest.mock('bcrypt');

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let getUserByEmail: jest.Mocked<GetUserByEmailUseCase>;
  let generateTokenUseCase: jest.Mocked<GenerateTokenUseCase>;

  const mockUser = (overrides?: Partial<User>): User =>
    Object.assign(new User(), {
      id: '123',
      email: 'test@example.com',
      password: 'hashedPassword',
      ...overrides,
    });

  beforeEach(() => {
    getUserByEmail = {
      execute: jest.fn(),
    } as any;

    generateTokenUseCase = {
      execute: jest.fn(),
    } as any;

    loginUseCase = new LoginUseCase(getUserByEmail, generateTokenUseCase);
  });

  it('should return accessToken when credentials are valid', async () => {
    const user = mockUser();
    getUserByEmail.execute.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    generateTokenUseCase.execute.mockResolvedValue({
      accessToken: 'jwt.token.valid',
    });

    const result = await loginUseCase.execute({
      email: 'test@example.com',
      password: '123456',
    });

    expect(result).toEqual({ accessToken: 'jwt.token.valid' });
    expect(generateTokenUseCase.execute).toHaveBeenCalledWith({
      userId: '123',
      email: 'test@example.com',
    });
  });

  it('should throw UserNotFoundException if user not found', async () => {
    getUserByEmail.execute.mockResolvedValue(null);

    await expect(
      loginUseCase.execute({
        email: 'unknown@example.com',
        password: '123456',
      }),
    ).rejects.toThrow(UserNotFoundException);
  });

  it('should throw UserNotValidPasswordException if password is invalid', async () => {
    const user = mockUser();
    getUserByEmail.execute.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      loginUseCase.execute({
        email: 'test@example.com',
        password: 'wrongpassword',
      }),
    ).rejects.toThrow(UserNotValidPasswordException);
  });
});
