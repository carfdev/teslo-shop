import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'QVh0V@example.com',
    description: 'User email',
    uniqueItems: true,
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Bcd123',
    description: 'User password',
    format: 'password',
    minLength: 6,
    maxLength: 50,
  })
  @IsString()
  password: string;
}
