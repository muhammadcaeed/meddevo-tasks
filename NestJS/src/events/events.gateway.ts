import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@WebSocketGateway(8080)
export class EventsGateway {
  clients = [];
  @WebSocketServer() server;

  @SubscribeMessage('events')
  onEvent(client, data: any) {
    this.clients.push(client);
    console.log('user connected');
    return {status: 'events', message: 'WebSocket Connection Established'};
  }

  broadcast(message: any) {
    console.log('clients');
    this.clients.forEach(client => console.log(1));
    const broadCastMessage = JSON.stringify(message);
    for (let client of this.clients) {
      client.send(broadCastMessage);
    }
  }
}
