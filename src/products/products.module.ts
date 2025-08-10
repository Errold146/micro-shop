import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    controllers: [ProductsController],
    providers: [ProductsService],
    imports: [
        TypeOrmModule.forFeature([Product, ProductImage]),
        AuthModule,
    ],
    exports: [ProductsService, TypeOrmModule]
})

export class ProductsModule {}