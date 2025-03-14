import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { TypeORMError } from 'src/common/interfaces/typeORM-error.interface';
import { CommonService } from 'src/common/common.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly commonService: CommonService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);

      const { id, email, fullName } = user;
      return {
        id,
        email,
        fullName,
      };
    } catch (e) {
      const error = e as TypeORMError;
      this.commonService.handleExeptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true, fullName: true },
    });
    if (!user) {
      throw new BadRequestException('Check credentials');
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Check credentials');
    }

    const { id, fullName } = user;
    return {
      id,
      email,
      fullName,
    };
  }
}
