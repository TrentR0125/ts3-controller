import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "src/controllers/auth/auth.controller";
import { ENTITIES } from "src/models/classes/entites.class";
import { AuthService } from "src/services/auth.service";
import { ApiKeyStrategy } from "src/strategies/api-key.strategy";
import { JwtStrategy } from "src/strategies/jwt.strategy";

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
        TypeOrmModule.forFeature(ENTITIES),
        PassportModule.register({ session: false })
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        ApiKeyStrategy,
        JwtStrategy
    ]
})
export class AuthModule {}