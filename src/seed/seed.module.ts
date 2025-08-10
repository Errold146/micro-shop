import { Module } from '@nestjs/common';

import { SeedService } from './seed.service';
import { AuthModule } from 'src/auth/auth.module';
import { SeedController } from './seed.controller';
import { ProductsModule } from 'src/products/products.module';

@Module({
    controllers: [SeedController],
    providers: [SeedService],
    imports: [ProductsModule, AuthModule]
})

export class SeedModule {}