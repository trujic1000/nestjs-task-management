import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const serverConfig = config.get('server');
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.PORT || serverConfig.port;
  await app.listen(3000);
  logger.log(`Application listening on port ${PORT}`);
}
bootstrap();
