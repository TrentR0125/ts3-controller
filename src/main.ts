import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { TsClient } from './common/classes/ts-client';
import { SwaggerConfigSetup } from './common/configurations/swagger.config';

import * as basicAuth from "express-basic-auth";
import { API_KEY_HEADER, JWT_TOKEN_HEADER } from './common/classes';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);

  app.setGlobalPrefix("api");
  app.enableCors({
    methods: ["DELETE", "GET", "PATCH", "POST", "PUT"],
    allowedHeaders: ["Content-Type", JWT_TOKEN_HEADER, API_KEY_HEADER],
    exposedHeaders: [API_KEY_HEADER, JWT_TOKEN_HEADER]
  });
  app.use("swagger", basicAuth({
    challenge: true,
    users: { development: "[,10z" }
  }));

  SwaggerConfigSetup.setup(app);
  await TsClient.connect(config);

  await app.listen(config.get<number>("API_PORT") as number);
}
bootstrap();
