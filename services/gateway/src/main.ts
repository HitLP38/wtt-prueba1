import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const isProduction = process.env.NODE_ENV === 'production';
  
  const app = await NestFactory.create(AppModule, {
    // Logging: Solo warn/error en producción
    logger: isProduction
      ? ['warn', 'error']
      : ['log', 'debug', 'warn', 'error'],
  });
  
  // Global prefix
  app.setGlobalPrefix('api');
  
  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });
  
  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  logger.log(`🚀 Gateway running on: http://localhost:${port}`);
  logger.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`🛡️ Rate Limiting: Enabled (100 req/min)`);
}

bootstrap();


