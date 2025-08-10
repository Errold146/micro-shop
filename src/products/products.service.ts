import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validate as isUUID } from 'uuid';

import { ProductImage, Product } from './entities';
import type { User } from 'src/auth/entities/user.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { generateUniqueSlug } from 'src/common/helpers/slug.helper';
import { PaginatedProductsResponseDto } from './dto/paginated-product-response.dto';

@Injectable()
export class ProductsService {

    private readonly logger = new Logger('ProductsService')
    
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        @InjectRepository(ProductImage)
        private readonly productImageRepository: Repository<ProductImage>
    ){}

    async create(createProductDto: CreateProductDto, user: User): Promise<Product> {
        try {
            const { images = [], slug, title, tags = [], ...rest } = createProductDto;
            const baseSlug = slug?.trim() || title;

            const finalSlug = await generateUniqueSlug(
                baseSlug,
                async (slugCandidate) => {
                    const existing = await this.productRepository.findOneBy({ slug: slugCandidate });
                    return !!existing;
                }
            );

            const product = this.productRepository.create({
                tags,
                title,
                slug: finalSlug,
                images: images.map( img => this.productImageRepository.create({url: img}) ),
                ...rest,
                user
            });

            await this.productRepository.save(product);
            return product;

        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    async findAll(paginationDto: PaginationDto): Promise<PaginatedProductsResponseDto> {
        try {
            const { limit = 10, offset = 0 } = paginationDto;

            const [products, totalItems] = await this.productRepository.findAndCount({
                take: limit,
                skip: offset,
                relations: ['images'],
                order: { title: 'ASC' }, // Opcional: orden alfabético
            });

            if (!products || products.length === 0) {
                throw new NotFoundException('Productos no encontrados.');
            }

            const transformedProducts: ProductResponseDto[] = products.map(prod => ({
               ...prod,
                images: prod.images?.map(img => img.url) ?? [],
            }));

            return {
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: Math.floor(offset / limit) + 1,
                limit,
                products: transformedProducts,
            };

        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    async findOne(term: string): Promise<ProductResponseDto> {
        try {
            const field = this.resolveSearchField(term);

            const queryBuilder = this.productRepository.createQueryBuilder('product')
                .leftJoinAndSelect('product.images', 'images');

            this.buildSearchCondition(queryBuilder, field, term);

            const product = await queryBuilder.getOne();

            if (!product) {
                throw new NotFoundException(`Producto con ${field} '${term}' no encontrado.`);
            }

            return {
                ...product,
                images: product.images?.map(img => img.url) ?? [],
            }

        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    async update(id: string, updateProductDto: UpdateProductDto, user: User): Promise<ProductResponseDto> {
        try {
            const { images, title, ...rest } = updateProductDto;

            const product = await this.productRepository.findOne({
                where: { id },
                relations: ['images'],
            });

            if (!product) {
                throw new NotFoundException(`El Producto con el id: ${id} no fue encontrado`);
            }

            // Actualizar slug si cambia el título
            if (title) {
                const newSlug = await generateUniqueSlug(
                    title,
                    async (slugCandidate) => {
                        const existing = await this.productRepository.findOneBy({ slug: slugCandidate });
                        return !!(existing && existing.id !== id);
                    }
                );
                product.slug = newSlug;
            }

            // Actualizar campos restantes
            Object.assign(product, { title, ...rest });

            // Reemplazar imágenes si se proporcionan
            if (images) {
                await this.productImageRepository.delete({ product: { id } });

                product.images = images.map(url =>
                    this.productImageRepository.create({ url })
                );
            }

            product.user = user

            const updated = await this.productRepository.save(product);

            return {
                ...updated,
                images: updated.images?.map(img => img.url) ?? [],
            };

        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    async remove(id: string) {
        try {
            const productEntity = await this.productRepository.findOne({
                where: { id },
                relations: ['images'], // Esto carga las imágenes
            });

            if (!productEntity) {
                throw new NotFoundException(`Producto con id ${id} no fue encontrado.`);
            }

            await this.productRepository.remove(productEntity); // Elimina en cascada

            return {
                message: `Producto '${productEntity.title}' eliminado correctamente.`
            }
            
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    async removeAllProducts() {

        try {
            const products = await this.productRepository.find({ relations: ['images'] });

            for (const product of products) {
                if (product.images?.length) {
                    await this.productImageRepository.remove(product.images);
                }

                await this.productRepository.remove(product);
            }

            return { message: `Todos los productos han sido eliminados correctamente.` };
            
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    private handleDBExceptions( error: any ): never {

        if ( error instanceof NotFoundException ) {
            throw error
        }

        if (error.code === '23505') {
            throw new BadRequestException(error.detail)
        }
        
        this.logger.error(error)

        throw new InternalServerErrorException(
            'Ups... algo salió mal. Ya estamos revisando el problema. Puedes intentar más tarde.'
        );
    }

    private resolveSearchField(term: string): 'id' | 'slug' | 'title' {
        
        // si es UUID
        if ( isUUID(term) ) return 'id';

        // Titulo con espacios, mayúsculas y sin guiones
        if ( /[A-Z\s]/.test(term) ) return 'title';

        // Slug = todo minúsculas, sin espacios y con guiones
        if ( /^[a-z0-9\-]+$/.test(term) ) return 'slug';

        // Otros, asumiendo ser título
        return 'title'
    }

    private buildSearchCondition(queryBuilder: SelectQueryBuilder<Product>, field: string, term: string): void {
        if (field === 'id') {
            queryBuilder.where(`product.id = :term`, { term });
        } else {
            queryBuilder.where(`product.${field} ILIKE :term`, { term: `%${term}%` });
        }
    }
}

/**
 * Bonus: ¿Y si el frontend necesita el id de la imagen en finAll o findOne?
 * Solo cambia el tipo en el DTO:
 * images: { id: number; url: string }[]
 *
 * Y el mapeo:
 * images: product.images?.map(img => ({ id: img.id, url: img.url })) ?? []
 *
*/