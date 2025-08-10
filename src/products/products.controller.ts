import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';

import { ValidRoles } from 'src/auth/interfaces';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    @Auth(ValidRoles.superUser)
    create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
        return this.productsService.create(createProductDto, user);
    }

    @Get()
    findAll(@Query() paginationDto: PaginationDto) {
        return this.productsService.findAll(paginationDto);
    }

    @Get(':term')
    findOne(@Param('term') term: string) {
        return this.productsService.findOne(term);
    }

    @Patch(':id')
    @Auth(ValidRoles.admin)
    update(
        @Param('id', ParseUUIDPipe) id: string, 
        @Body() updateProductDto: UpdateProductDto,
        @GetUser() user: User
    ) {
        return this.productsService.update(id, updateProductDto, user);
    }

    @Delete(':id')
    @Auth(ValidRoles.admin)
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}
