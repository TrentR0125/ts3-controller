import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SetupModule } from './modules/setup/setup.module';
import { SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { TsClient } from './common/classes/ts-client';
import { SwaggerConfigSetup } from './common/configurations/swagger.config';
import { API_KEY_HEADER, JWT_TOKEN_HEADER } from './common/classes';
import { Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync } from 'fs';
import * as basicAuth from "express-basic-auth";
import * as path from 'path';

async function bootstrap() {
  const envPath = path.join(process.cwd(), '.env');

  if (!existsSync(envPath)) {
    Logger.log('TS3-Controller API Setup: .env not found. Launching setup wizard...');

    const setupApp = await NestFactory.create<NestExpressApplication>(SetupModule);
    
    setupApp.useStaticAssets(path.join(process.cwd(), 'public'));
    setupApp.setGlobalPrefix('');

    await setupApp.listen(3000);

    Logger.log('Setup wizard running at http://localhost:3000/setup');
    return;
  }

  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);

  app.setGlobalPrefix("api");
  app.enableCors({
    origin: ["http://localhost:4200"],
    methods: ["DELETE", "GET", "PATCH", "POST", "PUT"],
    allowedHeaders: ["Content-Type", JWT_TOKEN_HEADER, API_KEY_HEADER],
    exposedHeaders: [API_KEY_HEADER, JWT_TOKEN_HEADER]
  });

  // Swagger with basic auth
  app.use("swagger", basicAuth({
    challenge: true,
    users: { development: "[,10z" }
  }));

  SwaggerConfigSetup.setup(app);

  await TsClient.connect(config);

  const port = config.get<number>("API_PORT") || 3000;
  await app.listen(port);

  Logger.log(`App running on ${config.get<string>("API_HOST") || 'http://localhost'}:${port}`);
}

bootstrap();
