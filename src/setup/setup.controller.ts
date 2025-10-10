import { Body, Controller, Get, HttpCode, Post, Res } from "@nestjs/common";
import { SetupService } from "./setup.service";
import { Response } from "express";
import { join } from "path";

@Controller('setup')
export class SetupController {
    constructor(private readonly setupService: SetupService) {}

    @Get()
    serveSetup(@Res() res: Response) {
        const file = join(process.cwd(), 'public', 'setup.html');
        return res.sendFile(file);
    }

    @Post('apply')
    apply(@Body() body: Record<string, any>) {
        return this.setupService.applyConfig(body);
    }

    @Post('restart')
    @HttpCode(200)
    restart() {
        this.setupService.restartProcess();
        return { ok: true, message: 'Restarting API...' };
    }
}
