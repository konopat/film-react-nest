import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';

import { configProvider } from './app.config.provider';
import { FilmsController } from './films/films.controller';
import { OrderController } from './order/order.controller';
import { FilmsService } from './films/films.service';
import { OrderService } from './order/order.service';
import { TypeOrmFilmsRepository } from './repository/typeorm-films.repository';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    DatabaseModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content'),
      serveRoot: '/content',
    }),
  ],
  controllers: [FilmsController, OrderController],
  providers: [
    configProvider,
    FilmsService,
    OrderService,
    {
      provide: 'IFilmsRepository',
      useClass: TypeOrmFilmsRepository,
    },
  ],
})
export class AppModule {}
