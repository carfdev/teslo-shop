import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
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
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({
    example: 'Fernando Herrera',
    description: 'User full name',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  fullName: string;
}
