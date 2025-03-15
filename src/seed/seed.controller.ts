import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { ApiHeader, ApiResponse } from '@nestjs/swagger';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @Auth(ValidRoles.admin)
  @ApiResponse({
    status: 200,
    description: 'Seed executed',
    example: 'SEED EXECUTED',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
    required: true,
  })
  executeSeed() {
    return this.seedService.execute();
  }
}
