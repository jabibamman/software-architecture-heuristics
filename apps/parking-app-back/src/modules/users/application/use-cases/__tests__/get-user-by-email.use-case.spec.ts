import { GetUserByEmailUseCase } from '@/modules/users/application/use-cases';
import { UserRepositoryPort } from '@/modules/users/application/ports/user.repository.port';
import { User } from '@/modules/users/domain/entities/user.entity';
import { UserNotFoundException } from '@/modules/users/domain/exceptions';

describe('GetUserByEmailUseCase', () => {
  let useCase: GetUserByEmailUseCase;
  let repo: jest.Mocked<UserRepositoryPort>;

  const dummyUser: User = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
  } as User;

  beforeEach(() => {
    repo = {
      findByEmail: jest.fn(),
    } as unknown as jest.Mocked<UserRepositoryPort>;

    useCase = new GetUserByEmailUseCase(repo);
  });

  it('should return user when found by email', async () => {
    repo.findByEmail.mockResolvedValue(dummyUser);

    const result = await useCase.execute('test@example.com');

    expect(repo.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(result).toEqual(dummyUser);
  });

  it('should throw UserNotFoundException when user is not found and throwIfNotFound is true', async () => {
    repo.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute('notfound@example.com', { throwIfNotFound: true }),
    ).rejects.toThrow(UserNotFoundException);
  });

  it('should return null when user is not found and throwIfNotFound is false', async () => {
    repo.findByEmail.mockResolvedValue(null);

    const result = await useCase.execute('notfound@example.com');
    expect(result).toBeNull();
  });
});
