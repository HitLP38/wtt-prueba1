import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { TableLockService } from './services/table-lock.service';
import { TableStatusService } from './services/table-status.service';
import { ScoringService } from './services/scoring.service';
import { Match } from './entities/match.entity';
import { Table } from './entities/table.entity';
import { TableLock } from './entities/table-lock.entity';
import { Set } from './entities/set.entity';
import { MatchAssignment } from './entities/match-assignment.entity';
import { MatchIncident } from './entities/match-incident.entity';

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
      entities: [Match, Table, TableLock, Set, MatchAssignment, MatchIncident],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forFeature([Match, Table, TableLock, Set, MatchAssignment, MatchIncident]),
  ],
  controllers: [MatchesController],
  providers: [MatchesService, TableLockService, TableStatusService, ScoringService],
  exports: [TableLockService, TableStatusService, ScoringService],
})
export class AppModule {}


