import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RequireAuthGuard } from './guards/require-auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { EventsModule } from './modules/events/events.module';
import { TeamSpeakModule } from './modules/teamspeak/teamspeak.module';

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
        // migrations: [__dirname + '/**/*.migrations{.ts,.js}'], // here just in-case we use migrations in the future
        autoLoadEntities: true,
        synchronize: config.get<string>("API_ENV") == "development"
      }),
    }),
    UserModule,
    AuthModule,
    EventsModule,
    TeamSpeakModule
  ],
  providers: [
    { provide: APP_GUARD, useClass: RequireAuthGuard }
  ],
})
export class AppModule {}
