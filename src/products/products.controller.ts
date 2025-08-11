import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';

import { Product } from './entities';
import { ValidRoles } from 'src/auth/interfaces';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    @Auth(ValidRoles.superUser)
    @ApiResponse({ status: 201, description: 'Producto creado correctamente', type: Product })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
    create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
        return this.productsService.create(createProductDto, user);
    }

    @Get()
    @ApiResponse({ status: 404, description: 'Products not found.' })
    @ApiResponse({ status: 400, description: 'Error details.' })
    @ApiResponse({ status: 500, description: 'Internal Server Error.' })
    findAll(@Query() paginationDto: PaginationDto) {
        return this.productsService.findAll(paginationDto);
    }

    @Get(':term')
    @ApiResponse({ status: 404, description: 'The product "..." with the term "..." was not found.' })
    @ApiResponse({ status: 400, description: 'Error details.' })
    @ApiResponse({ status: 500, description: 'Internal Server Error.' })
    findOne(@Param('term') term: string) {
        return this.productsService.findOne(term);
    }

    @Patch(':id')
    @Auth(ValidRoles.admin)
    @ApiResponse({ status: 404, description: 'The product with the id, was not found.' })
    @ApiResponse({ status: 400, description: 'Error details.' })
    @ApiResponse({ status: 500, description: 'Internal Server Error.' })
    update(
        @Param('id', ParseUUIDPipe) id: string, 
        @Body() updateProductDto: UpdateProductDto,
        @GetUser() user: User
    ) {
        return this.productsService.update(id, updateProductDto, user);
    }

    @Delete(':id')
    @Auth(ValidRoles.admin)
    @ApiResponse({ status: 404, description: 'The product with the id, was not found.' })
    @ApiResponse({ status: 400, description: 'Error details.' })
    @ApiResponse({ status: 500, description: 'Internal Server Error.' })
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}
