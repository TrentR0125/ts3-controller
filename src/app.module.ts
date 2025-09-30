import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './guards/api-key.guard';
import { JwtGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "mysql",
        host: config.get<string>("MYSQL"),
        port: config.get<number>("MYSQL_PORT"),
        username: config.get<string>("MYSQL_USER"),
        password: config.get<string>("MYSQL_PASS"),
        database: config.get<string>("MYSQL_DATABASE"),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        // migrations: [__dirname + '/**/*.migartions{.ts,.js}'], // here just in-case we use migrations in the future
        autoLoadEntities: true,
        synchronize: config.get<string>("API_ENV") == "development"
      }),
    }),
    UserModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ApiKeyGuard },
    { provide: APP_GUARD, useClass: JwtGuard },
  ],
})
export class AppModule {}
