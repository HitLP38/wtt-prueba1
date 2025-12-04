import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('InscriptionsService');
  const isProduction = process.env.NODE_ENV === 'production';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
      logger: isProduction ? ['warn', 'error'] : ['log', 'debug', 'warn', 'error'],
    },
  );

  await app.listen();
  logger.log('📝 Inscriptions Service is listening');
}

bootstrap();


