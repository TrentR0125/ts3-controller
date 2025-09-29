export class CreateServerDto {
    serverName: string;
    serverIp: string;
    serverPort: number;
    queryPort: number;
    queryName: string;
    queryPassword: string;
}