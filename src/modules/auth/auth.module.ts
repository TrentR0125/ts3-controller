import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Log } from "src/modules/events/entities/log.entity";
import { AuthController } from "src/modules/auth/controllers/auth.controller";
import { AuthService } from "src/modules/auth/services/auth.service";
import { ApiKeyStrategy } from "src/modules/auth/strategies/api-key.strategy";
import { JwtStrategy } from "src/modules/auth/strategies/jwt.strategy";

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '12h' }
            })
        }),
        PassportModule.register({ defaultStrategy: "jwt", session: false })
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        ApiKeyStrategy,
        JwtStrategy
    ]
})
export class AuthModule {}