import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { TypeORMError } from 'src/common/interfaces/typeORM-error.interface';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { validate as isUUID } from 'uuid';
import { ProductImage, Product } from './entities';
import { CommonService } from 'src/common/common.service';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,

    private readonly commonService: CommonService,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    try {
      const { images = [], ...productDetails } = createProductDto;
      const product = this.productRepository.create({
        ...productDetails,
        user,
        images: images.map((image) => {
          return this.productImageRepository.create({ url: image });
        }),
      });
      await this.productRepository.save(product);
      return { ...product, images };
    } catch (e) {
      const error = e as TypeORMError;
      this.commonService.handleExeptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
    });
    return products.map(({ images, ...product }) => ({
      ...product,
      images: images.map((image) => image.url),
    }));
  }

  async findOne(term: string) {
    let product: Product | null;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      product = await this.productRepository.findOneBy({ slug: term });
    }

    if (!product) {
      throw new NotFoundException(`Product with ${term} not found`);
    }

    return {
      ...product,
      images: product.images.map((image) => image.url),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const { images, ...toUpdate } = updateProductDto;
    const product = await this.productRepository.preload({
      id,
      ...toUpdate,
    });

    if (!product)
      throw new NotFoundException(`Product with ID ${id} not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map((image) => {
          return this.productImageRepository.create({ url: image });
        });
      } else {
        product.images = await queryRunner.manager.find(ProductImage, {
          where: { product: { id } },
        });
      }
      product.user = user;
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return {
        ...product,
        images: product.images.map((image) => image.url),
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.commonService.handleExeptions(e as TypeORMError);
    }
  }

  async remove(id: string) {
    const result = await this.productRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      return await query.delete().where({}).execute();
    } catch (e) {
      this.commonService.handleExeptions(e as TypeORMError);
    }
  }
}
