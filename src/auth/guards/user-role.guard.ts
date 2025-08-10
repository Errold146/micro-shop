import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

import { META_ROLES } from '../decorators';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const validRoles: string[] = this.reflector.get<string[]>(META_ROLES, context.getHandler());

        if ( !validRoles ) return true;
        if ( validRoles.length === 0 ) return true;

        const req = context.switchToHttp().getRequest()
        const user = req.user as User

        if ( !user ) throw new BadRequestException('Lo sentimos, el usuario ne fue encontrado.');
        
        for( const role of user.roles ) {
            if ( validRoles.includes(role) ) {
                return true
            }
        }

        throw new ForbiddenException(`Lo sentimos: ${user.fullName} no tienes los permisos necesarios.`)
    }
}