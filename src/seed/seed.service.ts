import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { initialData } from './data/seed-data';
import { Product } from 'src/products/entities';
import { User } from 'src/auth/entities/user.entity';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class SeedService {

    constructor(
        private readonly productService: ProductsService,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    async runSeed() {

        await this.deleteTables()
        const insertUser = await this.insertUsers()
        await this.insertNewProducts(insertUser)
        return {
            message: 'SEED EXCUTED SUCCESSFULLY...' 
        }
    }

    private async deleteTables() {

        await this.productService.removeAllProducts()
        const queryBuilder = this.userRepository.createQueryBuilder()
        await queryBuilder.delete().where({}).execute()
    }

    private async insertUsers() {
        
        const seedUser = initialData.users
        const users: User[] = []
        seedUser.forEach( us => {
            users.push( this.userRepository.create(us) )
        })
        const dbUsers = await this.userRepository.save(seedUser)

        return dbUsers[0]
    }

    private async insertNewProducts(user: User) {
        
        await this.productService.removeAllProducts()

        const products = initialData.products
        const insertPromises: Promise<Product>[] = [];
        products.forEach(prod => insertPromises.push(this.productService.create(prod, user)));
        await Promise.all(insertPromises)

        return true
    }
}
