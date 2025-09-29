import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TsClient } from './classes/teamspeak/ts-client';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  SwaggerModule.setup
  await TsClient.connect();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
