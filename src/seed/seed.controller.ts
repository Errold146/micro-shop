import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { Auth } from 'src/auth/decorators';
import { SeedService } from './seed.service';
import { ValidRoles } from 'src/auth/interfaces';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
    
    constructor(private readonly seedService: SeedService) {}

    @Get()
    @ApiResponse({ status: 201, description: 'SEED EXCUTED SUCCESSFULLY' })
    @ApiResponse({ status: 403, description: 'You do not have the permits' })
    @Auth(ValidRoles.admin, ValidRoles.superUser)
    executeSeed() {
        return this.seedService.runSeed()
    }
}
