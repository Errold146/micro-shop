import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetUser = createParamDecorator(
    ( data, ctx: ExecutionContext ) => {
        const req = ctx.switchToHttp().getRequest()
        const user = req.user

        if ( !user ) throw new InternalServerErrorException('Lo sentimos pero el usuario no fue encontrado.')

        return ( !data ) ? user : user[data]
    }
)