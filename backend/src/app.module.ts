import { Module, DynamicModule } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as path from 'node:path';

import { configProvider } from './app.config.provider';
import { FilmsController } from './films/films.controller';
import { OrderController } from './order/order.controller';
import { FilmsService } from './films/films.service';
import { OrderService } from './order/order.service';
import { FilmsRepository } from './repository/films.repository';
import { TypeOrmFilmsRepository } from './repository/typeorm-films.repository';
import { DatabaseModule } from './database/database.module';
import { Film, FilmSchema } from './repository/film.schema';

@Module({})
export class AppModule {
  static forRoot(): DynamicModule {
    // Сначала инициализируем ConfigModule чтобы ConfigService мог читать .env
    const configModule = ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    });

    // Теперь создаем ConfigService который может читать переменные окружения
    const configService = new ConfigService();
    const dbDriver = configService.get<string>('DATABASE_DRIVER', 'postgres');

    console.log(`🔧 DATABASE_DRIVER = ${dbDriver}`); // Добавляем логирование

    const baseImports = [
      configModule,
      ServeStaticModule.forRoot({
        rootPath: path.join(__dirname, '..', 'public', 'content'),
        serveRoot: '/content',
      }),
    ];

    let repositoryProvider;
    let imports;

    if (dbDriver === 'postgres') {
      console.log('📊 Using PostgreSQL with TypeORM');
      imports = [...baseImports, DatabaseModule];
      repositoryProvider = {
        provide: 'IFilmsRepository',
        useClass: TypeOrmFilmsRepository,
      };
    } else {
      console.log('🍃 Using MongoDB with Mongoose');
      imports = [
        ...baseImports,
        MongooseModule.forRootAsync({
          useFactory: (configService: ConfigService) => ({
            uri: configService.get<string>(
              'DATABASE_URL',
              'mongodb://localhost:27017/practicum',
            ),
          }),
          inject: [ConfigService],
        }),
        MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
      ];
      repositoryProvider = {
        provide: 'IFilmsRepository',
        useClass: FilmsRepository,
      };
    }

    return {
      module: AppModule,
      imports,
      controllers: [FilmsController, OrderController],
      providers: [
        configProvider,
        FilmsService,
        OrderService,
        repositoryProvider,
      ],
    };
  }
}
