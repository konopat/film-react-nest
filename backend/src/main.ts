// Полифилл для crypto в старых версиях Node.js (для CI окружения)
import { webcrypto } from 'crypto';

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto as Crypto;
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { LoggerFactory, LoggerType } from './logger/logger.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule.forRoot(), {
    bufferLogs: true,
  });

  // Выбор логгера через переменную окружения
  const loggerType = (process.env.LOGGER_TYPE || 'dev') as LoggerType;
  const logger = LoggerFactory.createLogger(loggerType);

  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  app.useLogger(logger);

  await app.listen(3000);
}
bootstrap();
