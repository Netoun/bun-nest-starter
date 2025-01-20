import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const appModule = await AppModule.forRoot();
  const app = await NestFactory.create(appModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    bufferLogs: true,
  });

  // Custom logger format
  const logger = new Logger('NestApplication');
  app.useLogger(logger);

  // Security
  app.use(helmet());
  app.use(compression());
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('NestJS + Bun + Drizzle API')
    .setDescription('Modern API with NestJS, Bun runtime and Drizzle ORM')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start server
  const port = process.env.PORT || 4000;
  await app.listen(port);

  // Colorful startup messages
  logger.log(
    `🚀 Application is running on: \x1b[36mhttp://localhost:${port}\x1b[0m`
  );
  logger.log(
    `📚 API Documentation: \x1b[36mhttp://localhost:${port}/api\x1b[0m`
  );

  if (process.env.NODE_ENV === 'development') {
    logger.debug('🛠️  Running in development mode');
  }
}

bootstrap();
