import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function main() {
    const app = await NestFactory.create(AppModule);
    const logger = new Logger('main')

    app.setGlobalPrefix('api')
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        })
    );

    const config = new DocumentBuilder()
        .setTitle('Micro-shop RESTFul API')
        .setDescription('Micro Shop endpoints')
        .setVersion('1.0')
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, documentFactory)

    await app.listen(process.env.PORT ?? 3000);
    logger.log(`App running on port ${process.env.PORT}`)
}

main();