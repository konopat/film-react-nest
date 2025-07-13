import { Module, DynamicModule } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as path from 'node:path';
import * as dotenv from 'dotenv';

import { configProvider } from './app.config.provider';
import { FilmsController } from './films/films.controller';
import { OrderController } from './order/order.controller';
import { FilmsService } from './films/films.service';
import { OrderService } from './order/order.service';
import { FilmsRepository } from './repository/films.repository';
import { TypeOrmFilmsRepository } from './repository/typeorm-films.repository';
import { DatabaseModule } from './database/database.module';
import { Film, FilmSchema } from './repository/film.schema';

// Загружаем .env файл в process.env до инициализации модулей
dotenv.config();

@Module({})
export class AppModule {
  static forRoot(): DynamicModule {
    // Теперь process.env содержит переменные из .env файла
    const dbDriver = process.env.DATABASE_DRIVER || 'postgres';

    const baseImports = [
      ConfigModule.forRoot({
        isGlobal: true,
        cache: true,
      }),
      ServeStaticModule.forRoot({
        rootPath: path.join(__dirname, '..', 'public', 'content'),
        serveRoot: '/content',
      }),
    ];

    let repositoryProvider;
    let imports;

    if (dbDriver === 'postgres') {
      imports = [...baseImports, DatabaseModule];
      repositoryProvider = {
        provide: 'IFilmsRepository',
        useClass: TypeOrmFilmsRepository,
      };
    } else {
      imports = [
        ...baseImports,
        MongooseModule.forRootAsync({
          useFactory: (configService: ConfigService) => {
            const uri = configService.get<string>(
              'DATABASE_URL',
              'mongodb://localhost:27017/practicum',
            );
            return { uri };
          },
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
