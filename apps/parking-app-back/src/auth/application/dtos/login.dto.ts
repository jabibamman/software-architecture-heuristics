import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'john@example.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'Password123?',
    required: true,
  })
  @IsNotEmpty()
  @IsStrongPassword()
  password!: string;

  static from(email: string, password: string): LoginDto {
    const dto = new LoginDto();
    dto.email = email;
    dto.password = password;
    return dto;
  }
}
