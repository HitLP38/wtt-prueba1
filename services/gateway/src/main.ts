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
  
  // CORS - Permitir cualquier origen en desarrollo, o el específico en producción
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const corsOrigin = isProduction
    ? frontendUrl
    : true; // Permitir todos los orígenes en desarrollo
  
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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
  // Escuchar en todas las interfaces (0.0.0.0) para permitir conexiones externas
  await app.listen(port, '0.0.0.0');
  
  logger.log(`🚀 Gateway running on: http://0.0.0.0:${port}`);
  logger.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`🛡️ Rate Limiting: Enabled (100 req/min)`);
  logger.log(`🌐 CORS: ${isProduction ? `Restricted to ${corsOrigin}` : 'Allowed from any origin (development)'}`);
}

bootstrap();


