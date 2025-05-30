import { TokenResponseDto } from '../token-response.dto';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

describe('TokenResponseDto', () => {
  it('should validate a correct DTO', () => {
    const dto = plainToInstance(TokenResponseDto, {
      accessToken: 'valid.jwt.token.here',
    });
    const errors = validateSync(dto);
    expect(errors).toHaveLength(0);
  });

  it('should reject empty accessToken', () => {
    const dto = plainToInstance(TokenResponseDto, {
      accessToken: '',
    });
    const errors = validateSync(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('accessToken');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });
});
