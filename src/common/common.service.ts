import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { TypeORMError } from 'src/common/interfaces/typeORM-error.interface';

@Injectable()
export class CommonService {
  private readonly logger = new Logger('TypeORM');

  handleExeptions(error: TypeORMError) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Check server logs');
  }
}
