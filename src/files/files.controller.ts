import { BadRequestException, Controller, Get, Param, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { Response } from 'express';

import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';

@ApiTags('Files')
@Controller('files')
export class FilesController {
    constructor(
        private readonly filesService: FilesService,
        private readonly configService: ConfigService
    ) {}

    @Get('product/:imageName')
    @ApiResponse({ status: 200, description: 'Image uploaded successfully' })
    @ApiResponse({ status: 404, description: 'Image not found' })
    findOneImage( 
        @Res() res: Response,
        @Param('imageName') imageName: string 
    ) {
        const path = this.filesService.getImageProduct(imageName)
        res.sendFile(path)
    }

    @Post('product')
    @ApiResponse({ status: 200, description: 'Image updated successfully' })
    @ApiResponse({ status: 400, description: 'Error Message' })
    @UseInterceptors(FileInterceptor('file', { 
        fileFilter ,
        // limits: { fileSize: 10000 },
        storage: diskStorage({
            destination: './static/products',
            filename: fileNamer
        })
    }))
    uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Express.Request) {
        if (!file) {
            const errorMessage = req['fileError'] || 'Sin Archivo Seleccionado';
            throw new BadRequestException(errorMessage);
        }
        const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`

        return {
            secureUrl,
            message: 'Archivo subido exitosamente.'
        };
    }
}