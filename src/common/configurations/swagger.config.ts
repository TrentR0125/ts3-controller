import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import * as expAuth from "express-basic-auth";

export class SwaggerConfigSetup {
    static async setup(app: INestApplication) {
        const path = "swagger";
        const config = new DocumentBuilder()
            .setTitle("TS3 Controller API")
            .setVersion("v1")
            .build();
            
        const document = SwaggerModule.createDocument(app, config);

        SwaggerModule.setup(path, app, document, { customSiteTitle: "TS3 Controller" });
    }
}