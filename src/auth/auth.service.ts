import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { TypeORMError } from 'src/common/interfaces/typeORM-error.interface';
import { CommonService } from 'src/common/common.service';

import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly commonService: CommonService,
    private readonly jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);

      const { email, fullName } = user;
      return {
        email,
        fullName,
        token: this.getJwtToken({ email }),
      };
    } catch (e) {
      const error = e as TypeORMError;
      this.commonService.handleExeptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    loginUserDto.email = loginUserDto.email.toLowerCase().trim();
    const { password, email } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, fullName: true },
    });
    if (!user) {
      throw new BadRequestException('Check credentials');
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Check credentials');
    }

    const { fullName } = user;
    return {
      email,
      fullName,
      token: this.getJwtToken({ email }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
