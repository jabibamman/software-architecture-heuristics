import { GenerateTokenUseCase } from '@/modules/auth/application/use-cases';
import { User } from '@/modules/users/domain/entities/user.entity';
import { UserRepositoryPort } from '@/modules/users/application/ports/user.repository.port';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '@/modules/auth/application/dtos';

describe('GenerateTokenUseCase', () => {
  let useCase: GenerateTokenUseCase;
  let dummyUser: User;
  let repo: jest.Mocked<UserRepositoryPort>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    repo = {
      save: jest.fn(),
      findByEmail: jest.fn(),
    } as unknown as jest.Mocked<UserRepositoryPort>;

    jwtService = { sign: jest.fn() } as unknown as jest.Mocked<JwtService>;

    useCase = new GenerateTokenUseCase(jwtService);

    dummyUser = new User();
    dummyUser.id = 'user-123';
    dummyUser.email = 'john@example.com';
  });

  it('should generate token for user', async () => {
    repo.findByEmail.mockResolvedValue(dummyUser);
    jwtService.sign.mockReturnValue('valid.jwt.token');
    const payload = JwtPayload.from(dummyUser);
    const result = await useCase.execute(payload);
    expect(result).toEqual({ accessToken: 'valid.jwt.token' });
    expect(jwtService.sign).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-123',
        email: 'john@example.com',
      }),
      { expiresIn: '5m' },
    );
  });
});
