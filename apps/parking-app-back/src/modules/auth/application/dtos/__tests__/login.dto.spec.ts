import { LoginDto } from '@/modules/auth/application/dtos';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

describe('LoginDto', () => {
  it('should validate a correct DTO', () => {
    const dto = plainToInstance(LoginDto, {
      email: 'john@example.com',
      password: 'Password123?',
    });
    const errors = validateSync(dto);
    expect(errors).toHaveLength(0);
  });

  it('should reject empty email', () => {
    const dto = plainToInstance(LoginDto, {
      email: '',
      password: 'Password123?',
    });
    const errors = validateSync(dto);
    expect(errors).toHaveLength(1);
  });

  it('should reject invalid email format', () => {
    const dto = plainToInstance(LoginDto, {
      email: 'invalid-email',
      password: 'Password123?',
    });
    const errors = validateSync(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should reject empty password', () => {
    const dto = plainToInstance(LoginDto, {
      email: 'john@example.com',
      password: '',
    });
    const errors = validateSync(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should reject weak password', () => {
    const dto = plainToInstance(LoginDto, {
      email: 'john@example.com',
      password: 'weak',
    });
    const errors = validateSync(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints).toHaveProperty('isStrongPassword');
  });

  it('should create a DTO from static method', () => {
    const dto = LoginDto.from('john@example.com', 'Password123?');
    expect(dto).toBeInstanceOf(LoginDto);
    expect(dto.email).toBe('john@example.com');
    expect(dto.password).toBe('Password123?');
    const errors = validateSync(dto);
    expect(errors).toHaveLength(0);
  });
});
