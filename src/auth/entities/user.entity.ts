import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/products/entities';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'QVh0V@example.com',
    description: 'User email',
    uniqueItems: true,
    format: 'email',
  })
  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false })
  password: string;

  @ApiProperty({
    example: 'Fernando Herrera',
    description: 'User full name',
    minLength: 1,
  })
  @Column('text')
  fullName: string;

  @Column('bool', { default: true })
  isActive: boolean;

  @ApiProperty({
    example: ['user'],
    description: 'User roles',
    default: ['user'],
  })
  @Column('text', { array: true, default: ['user'] })
  roles: string[];

  @OneToMany(() => Product, (product) => product.user)
  product: Product[];

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'User token',
    required: false,
  })
  token?: string;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.email = this.email.toLowerCase().trim();
  }
}
