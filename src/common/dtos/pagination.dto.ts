import { Type } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsPositive, Min } from "class-validator"

export class PaginationDto {

    @ApiProperty({
        default: 10,
        description: 'How many rows do yo need.',
        required: false
    })
    @IsOptional()
    @IsPositive({message: 'El limite debe ser un número entero positivo'})
    @Type( () => Number )
    limit?: number

    @ApiProperty({
        default: 0,
        description: 'How many rows do you want to skip',
        required: false
    })
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    offset?: number
}