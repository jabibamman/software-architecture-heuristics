import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class TokenResponseDto {
  @ApiProperty({
    description: 'Access token for the user',
    required: true,
  })
  @IsNotEmpty()
  accessToken!: string;

  static from(accessToken: string): TokenResponseDto {
    return {
      accessToken: accessToken,
    };
  }
}
