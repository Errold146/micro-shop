import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator"

export class LoginUserDto {

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
}