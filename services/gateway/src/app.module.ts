import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { RefereeController } from './referee.controller';
import { RefereeService } from './referee.service';
import { EventConfigController } from './controllers/event-config.controller';
import { EventConfigService } from './services/event-config.service';
import { TemplateController } from './controllers/template.controller';
import { TemplateService } from './services/template.service';
import { ProspectController } from './controllers/prospect.controller';
import { ProspectService } from './services/prospect.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Rate Limiting - Protección contra abuso y DDoS
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minuto
        limit: 100, // 100 requests por minuto por IP
      },
    ]),
    ClientsModule.register([
      {
        name: 'EVENTOS_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
        },
      },
      {
        name: 'INSCRIPTIONS_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
        },
      },
      {
        name: 'TEAMS_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
        },
      },
      {
        name: 'MATCHES_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
        },
      },
    ]),
  ],
  controllers: [
    GatewayController,
    AdminController,
    RefereeController,
    EventConfigController,
    TemplateController,
    ProspectController,
  ],
  providers: [
    GatewayService,
    AdminService,
    RefereeService,
    EventConfigService,
    TemplateService,
    ProspectService,
    // Aplicar rate limiting globalmente
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}


