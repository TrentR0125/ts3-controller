import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TsClient } from './classes/ts-client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await TsClient.connect();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
