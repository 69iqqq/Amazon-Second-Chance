import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

import { json, urlencoded } from 'express';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // Global prefixes and versioning
  app.setGlobalPrefix('api/v1');

  // CORS
  app.enableCors({
    origin: true, // Allow all origins for network testing
    credentials: true,
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global Exception Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Swagger OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('Amazon 2nd Chance API')
    .setDescription('The core backend API for Amazon Second Chance ecosystem')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  logger.log(`🚀 Application is running on: http://localhost:${port}/api/v1`);
  logger.log(`📚 Swagger documentation on: http://localhost:${port}/api/docs`);
}
bootstrap();
