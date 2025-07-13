// Полифилл для crypto в старых версиях Node.js (для CI окружения)
import { webcrypto } from 'crypto';

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto as Crypto;
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule.forRoot());
  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
