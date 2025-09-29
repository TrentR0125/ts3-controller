import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TsClient } from './classes/teamspeak/ts-client';
import { SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { SwaggerConfigSetup } from './classes/configurations/swagger.config';

import * as basicAuth from "express-basic-auth";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);

  app.setGlobalPrefix("api");
  app.use("swagger", basicAuth({
    challenge: true,
    users: { development: "[,10z" }
  }));

  SwaggerConfigSetup.setup(app);
  await TsClient.connect(config);


  await app.listen(config.get<number>("API_PORT") as number);
}
bootstrap();
