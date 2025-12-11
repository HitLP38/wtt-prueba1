import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
      logger: process.env.NODE_ENV === 'production' 
        ? ['warn', 'error'] 
        : ['log', 'error', 'warn', 'debug', 'verbose'],
    },
  );

  await app.listen();
}
bootstrap();

