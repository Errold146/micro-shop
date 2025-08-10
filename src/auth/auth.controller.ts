import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { UserRoleGuard } from './guards/user-role.guard';
import { RawHeaders, GetUser, RoleProtected, Auth } from './decorators';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.authService.create(createUserDto);
    }

    @Post('login')
    loginUser(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }

    @Get('private')
    @UseGuards(AuthGuard()) 
    testPrivateRoute( 
        @GetUser() user: User, 
        @GetUser('email') userEmail: string,
        @RawHeaders() rawHeaders: string[]
    ) {
        return {
            ok: true,
            message: 'Hola Mundo Private',
            user,
            userEmail,
            rawHeaders
        }
    }

    @Get('private2')
    @RoleProtected(ValidRoles.admin)
    @UseGuards(AuthGuard(), UserRoleGuard )
    privateRoute2( @GetUser() user: User ) {
        return {
            ok: true,
            user
        }
    }
    
    @Get('private3')
    @Auth(ValidRoles.superUser)
    privateRoute3( @GetUser() user: User ) {
        return {
            ok: true,
            user
        }
    }

}
