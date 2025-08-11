import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator"

export class CreateUserDto {

    @ApiProperty({
        description: 'Email user.',
        nullable: false,
        uniqueItems: true
    })
    @IsEmail({}, { message: 'Email inválido' })
    email: string

    @ApiProperty({
        description: 'Password user',
        nullable: false,
        minLength: 8
    })
    @IsString()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    @MaxLength(50, { message: 'La contraseña no debe exceder los 50 caracteres.' })
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
            message: 'La contraseña debe tener una letra mayúscula, una minúscula y un número.'
        }
    )
    password: string

    @ApiProperty({
        description: 'User Full Name',
        nullable: false,
        minLength: 3
    })
    @IsString({message: 'El nombre debe ser una cadena de texto.'})
    @MinLength(3, { message: 'El nombre no puede ir vacío o es demasiado corto.'})
    fullName: string
}