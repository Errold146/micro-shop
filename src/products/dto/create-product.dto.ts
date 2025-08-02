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
    
    @IsString({ message: 'El titulo debe ser un texto' })
    @MinLength(3, { message: 'El titulo es demasiado corto' })
    title: string

    @IsNumber()
    @IsPositive({ message: 'El precio debe ser un número positivo' })
    @IsOptional()
    price?: number

    @IsString({ message: 'La descripción debe ser un texto' })
    @IsOptional()
    description?: string

    @IsString({ message: 'El slug debe ser un texto, unico e irrepetible.' })
    @IsOptional()
    slug?: string

    @IsInt({ message: 'El stock debe ser un número entero' })
    @IsPositive({ message: 'El stock debe ser un número positivo' })
    @IsOptional()
    stock?: number

    @IsString({ each: true, message: 'Todos los elemntos deben de ser texto' })
    @IsArray({ message: 'Las tallas deben ser un arreglo de textos' })
    @Transform(({ value }) => Array.isArray(value) ? value.map((size: string) => size.toUpperCase()) : [])
    sizes?: string[]

    @IsIn(['men', 'women', 'kid', 'unisex'], { message: 'El gender debe ser men, women, kid o unisex unicamente.' })
    gender: string

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

    @IsString({ each: true, message: 'La url de la imagen ¨debe ser un número.'})
    @IsArray()
    @IsOptional()
    images?: string[]

}
