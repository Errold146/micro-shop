import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import type { Product } from 'src/products/entities';

@Injectable()
export class SeedService {

    constructor(
        private readonly productService: ProductsService
    ){}

    async runSeed() {

        this.insertNewProducts()

        return {
            message: 'SEED EXCUTED SUCCESSFULLY...' 
        }
    }

    private async insertNewProducts() {
        
        await this.productService.removeAllProducts()

        const products = initialData.products
        const insertPromises: Promise<Product>[] = [];
        products.forEach(prod => insertPromises.push(this.productService.create(prod)));
        await Promise.all(insertPromises)

        return true
    }
}
