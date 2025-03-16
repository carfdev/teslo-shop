import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
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
export class AuthService implements OnModuleInit {
  private isFirstUser = false;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly commonService: CommonService,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    const count = await this.userRepository.count();
    this.isFirstUser = count === 0;
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const role = this.isFirstUser ? 'admin' : 'user';

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
        roles: [role],
      });
      await this.userRepository.save(user);

      if (this.isFirstUser) {
        this.isFirstUser = false;
      }

      const { email, fullName, id } = user;
      return {
        email,
        fullName,
        token: this.getJwtToken({ id }),
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
      select: { email: true, password: true, fullName: true, id: true },
    });
    if (!user) {
      throw new BadRequestException('Check credentials');
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Check credentials');
    }

    const { fullName, id } = user;
    return {
      email,
      fullName,
      token: this.getJwtToken({ id }),
    };
  }

  checkAuthStatus(user: User) {
    return {
      email: user.email,
      fullName: user.fullName,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
