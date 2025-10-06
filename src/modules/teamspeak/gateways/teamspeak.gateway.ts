import { WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'teamspeak' })
export class TeamSpeakGateway {

    @WebSocketServer()
    server: Server;

    private test() {}
}