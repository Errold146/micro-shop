import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { ValidRoles } from './interfaces';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { UserRoleGuard } from './guards/user-role.guard';
import { RawHeaders, GetUser, RoleProtected, Auth } from './decorators';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiResponse({ status: 201, description: 'User created successfully.' })
    @ApiResponse({ status: 404, description: 'Bad Request.' })
    @ApiResponse({ status: 500, description: 'Internal Server Error.' })
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.authService.create(createUserDto);
    }

    @Post('login')
    @ApiResponse({ status: 200, description: 'Session started' })
    @ApiResponse({ status: 401, description: 'Invalid credentials or incorrect credentials' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'IOnternal server error' })
    loginUser(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }

    @Get('check-status')
    @ApiResponse({ status: 403, description: 'You do not have the permits' })
    @Auth()
    checkAuthStatus( @GetUser() user: User ) {
        return this.authService.checkAuthStatus(user)
    }

    @Get('private')
    @ApiResponse({ status: 200, description: 'Ok' })
    @ApiResponse({ status: 403, description: 'You do not have the permits' })
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
    @ApiResponse({ status: 200, description: 'Ok' })
    @ApiResponse({ status: 403, description: 'You do not have the permits' })
    @RoleProtected(ValidRoles.admin)
    @UseGuards(AuthGuard(), UserRoleGuard )
    privateRoute2( @GetUser() user: User ) {
        return {
            ok: true,
            user
        }
    }
    
    @Get('private3')
    @ApiResponse({ status: 200, description: 'Ok' })
    @ApiResponse({ status: 403, description: 'You do not have the permits' })
    @Auth(ValidRoles.superUser)
    privateRoute3( @GetUser() user: User ) {
        return {
            ok: true,
            user
        }
    }

}
