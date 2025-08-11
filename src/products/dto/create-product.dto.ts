import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { 
    IsArray, 
    IsIn, 
    IsInt, 
    IsNumber, 
    IsOptional, 
    IsPositive, 
    IsString, 
    MinLength 
} from "class-validator";

export class CreateProductDto {
    
    @ApiProperty({
        description: 'Title product',
        nullable: false,
        minLength: 3
    })
    @IsString({ message: 'El titulo debe ser un texto' })
    @MinLength(3, { message: 'El titulo es demasiado corto' })
    title: string

    @ApiProperty({
        default: 0,
        description: 'Price product',
        required: false
    })
    @IsNumber()
    @IsPositive({ message: 'El precio debe ser un número positivo' })
    @IsOptional()
    price?: number

    @ApiProperty({
        description: 'Description product...',
        required: false
    })
    @IsString({ message: 'La descripción debe ser un texto' })
    @IsOptional()
    description?: string

    @ApiProperty({
        description: 'Based on the title',
        uniqueItems: true,
        required: false
    })
    @IsString({ message: 'El slug debe ser un texto, unico e irrepetible.' })
    @IsOptional()
    slug?: string

    @ApiProperty({
        description: 'Available quantity',
        default: 0,
        required: false
    })
    @IsInt({ message: 'El stock debe ser un número entero' })
    @IsPositive({ message: 'El stock debe ser un número positivo' })
    @IsOptional()
    stock?: number

    @ApiProperty({
        description: 'Available sizes',
        required: false,
        isArray: true
    })
    @IsString({ each: true, message: 'Todos los elemntos deben de ser texto' })
    @IsArray({ message: 'Las tallas deben ser un arreglo de textos' })
    @Transform(({ value }) => Array.isArray(value) ? value.map((size: string) => size.toUpperCase()) : [])
    sizes?: string[]

    @ApiProperty({
        description: 'Available genders',
        isArray: true,
        nullable: false
    })
    @IsIn(['men', 'women', 'kid', 'unisex'], { message: 'El gender debe ser men, women, kid o unisex unicamente.' })
    gender: string

    @ApiProperty({
        description: 'Product search tags',
        isArray: true,
        required: false
    })
    @IsString({ each: true, message: 'Todos los elemnetos deben ser texto.' })
    @IsArray({ message: 'Los Tags deben ser un arreglo de textos' })
    @IsOptional()
    @Transform(({ value }) => {
        if (!Array.isArray(value)) return [];
        const cleaned = value
            .map((tag: string) => tag.trim().toLowerCase())
            .filter((tag: string) => tag.length > 0);
        return Array.from(new Set(cleaned));
    })
    tags?: string[]

    @ApiProperty({
        description: 'Image URLs',
        nullable: true,
        required: false
    })
    @IsString({ each: true, message: 'La url de la imagen ¨debe ser un número.'})
    @IsArray()
    @IsOptional()
    images?: string[]

}
