import { join } from 'path';
import { existsSync } from 'fs';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
    getImageProduct(imageName: string) {
        
        const path = join( __dirname, '../../static/products', imageName )
        if ( !existsSync(path) ) throw new BadRequestException(`No se encontro la imagen: ${imageName}`);
        
        return path
    }
}
