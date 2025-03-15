import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessageWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;
  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers['x-token'] as string;

    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload: JwtPayload = this.jwtService.verify(token);
      await this.messageWsService.registerClient(client, payload.id);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      client.disconnect();
      return;
    }

    // console.log('Client connected', client.id);

    this.wss.emit(
      'clients-updated',
      this.messageWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    // console.log('Client disconnected', client.id);

    this.messageWsService.removeClient(client.id);
    this.wss.emit(
      'clients-updated',
      this.messageWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    //! Emitir únicamente a la persona que envió el mensaje
    // client.emit('message-from-server', {
    //   from: 'Soy Yo',
    //   message: payload.message,
    // });

    //! Emitir a todos menos al que envió el mensaje
    // client.broadcast.emit('message-from-server', {
    //   from: 'No Soy Yo',
    //   message: payload.message,
    // });

    //! Emitir a todos
    this.wss.emit('message-from-server', {
      from: this.messageWsService.getUserFullName(client.id),
      message: payload.message,
    });
  }
}
