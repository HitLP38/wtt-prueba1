import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Referee } from './entities/referee.entity';

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
      entities: [Referee],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    TypeOrmModule.forFeature([Referee]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

