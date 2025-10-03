import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { API_KEY_HEADER, JWT_TOKEN_HEADER } from "../classes/globals";

export class SwaggerConfigSetup {
    static async setup(app: INestApplication) {
        const path = "swagger";
        const config = new DocumentBuilder()
            .setTitle("TS3 Controller API")
            .setVersion("v1")
            .addApiKey({ name: API_KEY_HEADER, type: "apiKey", in: "header" }, API_KEY_HEADER)
            .addApiKey({ name: JWT_TOKEN_HEADER, type: "apiKey", in: "header" }, JWT_TOKEN_HEADER) // because bearer auth doesnt seem to want to cooperate with me 😡
            .build();
            
        const document = SwaggerModule.createDocument(app, config);

        SwaggerModule.setup(path, app, document, { customSiteTitle: "TS3 Controller" });
    }
}