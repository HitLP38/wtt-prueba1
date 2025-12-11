import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventosController } from './eventos.controller';
import { EventConfigController } from './controllers/event-config.controller';
import { TemplateController } from './controllers/template.controller';
import { ProspectController } from './controllers/prospect.controller';
import { EventosService } from './eventos.service';
import { EventAccessService } from './services/event-access.service';
import { EventSettingsService } from './services/event-settings.service';
import { OrganizationService } from './services/organization.service';
import { UserService } from './services/user.service';
import { CategoryService } from './services/category.service';
import { ModalityService } from './services/modality.service';
import { EventConfigService } from './services/event-config.service';
import { TemplateService } from './services/template.service';
import { PdfGeneratorService } from './services/pdf-generator.service';
import { Event } from './entities/event.entity';
import { EventReferee } from './entities/event-referee.entity';
import { EventSettings } from './entities/event-settings.entity';
import { Organization } from './entities/organization.entity';
import { User } from './entities/user.entity';
import { Category } from './entities/category.entity';
import { Modality } from './entities/modality.entity';
import { EventBasicInfo } from './entities/event-basic-info.entity';
import { EventAwards } from './entities/event-awards.entity';
import { EventEquipment } from './entities/event-equipment.entity';
import { EventRegistration } from './entities/event-registration.entity';
import { EventSeedingRules } from './entities/event-seeding-rules.entity';
import { CompetitionSystem } from './entities/competition-system.entity';
import { ConfigurationTemplate } from './entities/configuration-template.entity';
import { TemplateVersion } from './entities/template-version.entity';
import { EventProspect } from './entities/event-prospect.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'wtt_user',
      password: process.env.DB_PASSWORD || 'wtt_password',
      database: process.env.DB_NAME || 'wtt_db',
      entities: [
        Event,
        EventReferee,
        EventSettings,
        Organization,
        User,
        Category,
        Modality,
        EventBasicInfo,
        EventAwards,
        EventEquipment,
        EventRegistration,
        EventSeedingRules,
        CompetitionSystem,
        ConfigurationTemplate,
        TemplateVersion,
        EventProspect,
      ],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forFeature([
      Event,
      EventReferee,
      EventSettings,
      Organization,
      User,
      Category,
      Modality,
      EventBasicInfo,
      EventAwards,
      EventEquipment,
      EventRegistration,
      EventSeedingRules,
      CompetitionSystem,
      ConfigurationTemplate,
      TemplateVersion,
      EventProspect,
    ]),
  ],
  controllers: [EventosController, EventConfigController, TemplateController, ProspectController],
  providers: [
    EventosService,
    EventAccessService,
    EventSettingsService,
    OrganizationService,
    UserService,
    CategoryService,
    ModalityService,
    EventConfigService,
    TemplateService,
    PdfGeneratorService,
  ],
  exports: [
    EventAccessService,
    EventSettingsService,
    OrganizationService,
    UserService,
    CategoryService,
    ModalityService,
    EventConfigService,
    TemplateService,
    PdfGeneratorService,
  ],
})
export class AppModule {}


