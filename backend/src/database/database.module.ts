import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Film } from '../entities/film.entity';
import { Schedule } from '../entities/schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 5432),
        username: configService.get<string>('DATABASE_USERNAME', 'prac'),
        password: configService.get<string>('DATABASE_PASSWORD', 'prac'),
        database: configService.get<string>('DATABASE_NAME', 'prac'),
        entities: [Film, Schedule],
        synchronize: false,
        logging: configService.get<boolean>('DATABASE_LOGGING', false),
      }),
    }),
    TypeOrmModule.forFeature([Film, Schedule]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
