import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TsClient } from './classes/teamspeak/ts-client';
import { SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { SwaggerConfigSetup } from './classes/configurations/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);

  SwaggerConfigSetup.setup(app);
  await TsClient.connect(config);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
