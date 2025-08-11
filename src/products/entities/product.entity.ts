import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { User } from "src/auth/entities/user.entity";
import { ProductImage } from "./product-image.entity";

@Entity({name: 'products'})
export class Product {

    @ApiProperty({
        example: "9d74bfc9-48b0-4220-9d52-7ffc3c8bd9a3",
        description: 'Product Id = uuid',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'Product example...',
        description: 'Product Title',
        uniqueItems: true
    })
    @Column('text', { unique: true })
    title: string;

    @ApiProperty({
        example: 0,
        description: 'Price product'
    })
    @Column('float', { default: 0 })
    price: number;

    @ApiProperty({
        example: 'Nostrud adipisicing adipisicing ad culpa sit ipsum.',
        description: 'Description product',
        default: null
    })
    @Column('text', { nullable: true })
    description: string;

    @ApiProperty({
        example: 'product-example',
        description: 'Based on the title',
        uniqueItems: true
    })
    @Column('text', { unique: true })
    slug: string;

    @ApiProperty({
        example: 10,
        description: 'Available quantity',
        default: 0
    })
    @Column('int', { default: 0 })
    stock: number;

    @ApiProperty({
        example: ['S', 'XS', 'M', 'X', 'L', 'XL', 'XXl'],
        description: "Available sizes",
        isArray: true
    })
    @Column('text', { array: true, default: [] })
    sizes: string[];

    @ApiProperty({
        example: ['men', 'women', 'kid', 'unisex'],
        description: 'Available genders',
        isArray: true
    })
    @Column('text')
    gender: string;

    @ApiProperty({
        example: ['T-shirt', 'Pants', 'Caps', 'Tecnologi'],
        description: 'Tags to find products',
        isArray: true
    })
    @Column('text', { array: true, default: [] })
    tags: string[]

    @ManyToOne(
        () => User,
        user => user.product,
        { eager: true, onDelete: 'CASCADE' }
    )
    user: User

    @ApiProperty({ required: false })
    @OneToMany(
        () => ProductImage,
        productImage => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[]
}