import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {


    private readonly logger = new Logger('UserService')

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly jwtService: JwtService,
    ){}

    async create(createUserDto: CreateUserDto) {
        try {
            const { password, ...userData } = createUserDto
            const user = this.userRepository.create({
                ...userData,
                password: bcrypt.hashSync(password, 10)
            })
            await this.userRepository.save(user)
            
            return {
                ...userData,
                token: this.getJWT({ id: user.id })
            }

        } catch (error) {
            this.handleDBExceptions(error)
        }
    }

    findAll() {
        return `This action returns all auth`;
    }

    findOne(id: number) {
        return `This action returns a #${id} auth`;
    }

    // update(id: number, updateAuthDto: UpdateAuthDto) {
    //     return `This action updates a #${id} auth`;
    // }

    remove(id: number) {
        return `This action removes a #${id} auth`;
    }

    async login(loginUserDto: LoginUserDto) {
        try {
            const { password, email } = loginUserDto
            const user = await this.userRepository.findOne({
                where: { email },
                select: { email: true, password: true, id: true }
            })

            if ( !user ) throw new UnauthorizedException('Credenciales inválidas.');
            if ( !bcrypt.compareSync(password, user.password) ) throw new UnauthorizedException('Credenciales Incorrectas.');

            return {
                ...user,
                token: this.getJWT({ id: user.id })
            }

        } catch (error) {
            this.handleDBExceptions(error)
        }
    }

    async checkAuthStatus(user: User) {
        return {
            ...user,
            token: this.getJWT({ id: user.id })
        }
    }

    private getJWT(payload: JwtPayload) {
        const token = this.jwtService.sign( payload )
        return token
    }

    private handleDBExceptions( error: any ): never {

        if ( error instanceof NotFoundException || error instanceof UnauthorizedException ) {
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
}
