import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator"

export class CreateUserDto {

    @IsEmail({}, { message: 'Email inválido' })
    email: string

    @IsString()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    @MaxLength(50, { message: 'La contraseña no debe exceder los 50 caracteres.' })
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
            message: 'La contraseña debe tener una letra mayúscula, una minúscula y un número.'
        }
    )
    password: string

    @IsString({message: 'El nombre debe ser una cadena de texto.'})
    @MinLength(3, { message: 'El nombre no puede ir vacío o es demasiado corto.'})
    fullName: string
}