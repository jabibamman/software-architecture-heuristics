import { JwtPayload } from '@/modules/auth/application/dtos';
import { User } from '@/modules/users/domain/entities/user.entity';

describe('JwtPayload', () => {
  it('should create a DTO from static method', () => {
    const user = new User();
    user.id = '12345';
    user.email = 'john@example.com';
    const dto = JwtPayload.from(user);
    expect(dto).toBeInstanceOf(JwtPayload);
    expect(dto.userId).toBe('12345');
    expect(dto.email).toBe('john@example.com');
  });
});
