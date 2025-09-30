import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { QueryBus } from "@nestjs/cqrs";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "src/common/interfaces/jwt-payload.interface";
import { GetUserQuery } from "src/modules/user/queries/get-user.query";
import { UserService } from "src/modules/user/services/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private queryBus: QueryBus,
    configService: ConfigService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) throw new Error('JWT_SECRET is not set in environment (.env)');
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.queryBus.execute(new GetUserQuery(payload.userId || payload.emailAddress));

    if (!user) {
      throw new NotFoundException("User not found.")
    }

    return user;
  }
}