import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async execute() {
    await this.productsService.deleteAllProducts();
    const adminUser = await this.getAdminUser();
    await this.insertNewProducts(adminUser);
    return `SEED EXECUTED`;
  }

  private async getAdminUser() {
    const users = await this.userRepository.find({});
    const adminUser = users.find((user) => user.roles.includes('admin'));
    if (adminUser) {
      return adminUser;
    }
    throw new InternalServerErrorException('Admin user not found');
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
