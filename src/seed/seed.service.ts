import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async execute() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();
    await this.insertNewProducts(adminUser);
    return `SEED EXECUTED`;
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();
    const query = this.userRepository.createQueryBuilder();
    await query.delete().where({}).execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];

    seedUsers.forEach((user) => {
      user.password = bcrypt.hashSync(user.password, 10);
      users.push(this.userRepository.create(user));
    });
    await this.userRepository.save(users);
    return users[0];
  }

  private async insertNewProducts(user: User) {
    const products = initialData.products;

    const insertPromises = products.map((product) =>
      this.productsService.create(product, user),
    );

    await Promise.all(insertPromises);
    return true;
  }
}
