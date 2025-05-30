import { CreateUserUseCase } from '@/users/application/use-cases';
import { UserRepositoryPort } from '@/users/application/ports/user.repository.port';
import { User } from '@/users/domain/entities/user.entity';
import { UserConflictException } from '@/users/domain/exceptions/user-conflict.exception';
import { LoginDto } from '@/auth/application/dtos';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let repo: jest.Mocked<UserRepositoryPort>;

  const dto: LoginDto = {
    email: 'new@example.com',
    password: 'plaintext',
  };

  const hashedPassword = 'hashedPassword123';

  beforeEach(() => {
    repo = {
      findByEmail: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<UserRepositoryPort>;

    useCase = new CreateUserUseCase(repo);
    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
  });

  it('should create a new user and save it if email does not exist', async () => {
    repo.findByEmail.mockResolvedValue(null);
    repo.save.mockImplementation(async (user: User) => user);

    const result = await useCase.execute(dto);

    expect(repo.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
    expect(repo.save).toHaveBeenCalledWith(expect.any(User));
    expect(result.email).toBe(dto.email.toLowerCase());
    expect(result.password).toBe(hashedPassword);
  });

  it('should throw UserConflictException if email already exists', async () => {
    repo.findByEmail.mockResolvedValue(new User());

    await expect(useCase.execute(dto)).rejects.toThrow(
      new UserConflictException(dto.email),
    );
  });

  it('should hash password correctly when creating user entity', async () => {
    const result = await useCase.createUserEntity(dto.email, dto.password);

    expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
    expect(result.email).toBe(dto.email.toLowerCase());
    expect(result.password).toBe(hashedPassword);
  });
});
