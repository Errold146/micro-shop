import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
    controllers: [ProductsController],
    providers: [ProductsService],
    imports: [
        TypeOrmModule.forFeature([Product, ProductImage])
    ],
    exports: [ProductsService, TypeOrmModule]
})

export class ProductsModule {}