import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { EventsGateway } from './events/events.gateway';

@Controller()
export class AppController {
  credentials = {
    usernames: ['user1', 'user2', 'user3'],
    passwords: ['pass1', 'pass2', 'pass3']
  };

  constructor(
    private readonly appService: AppService,
    private eventsGateway: EventsGateway) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('updates')
  create(@Body() body) {
    const condition1 = body.username && body.password;
    if (!condition1) {
      this.eventsGateway.broadcast({status: false, message: 'Credentials not provided'});
      return {status: false, message: 'Please provide credentials'};
    }
    const username = body.username;
    const password = body.password;
    const condition2 = this.credentials.usernames.indexOf(username) > -1 && this.credentials.passwords.indexOf(password) > -1;
    if (!condition2) {
      this.eventsGateway.broadcast({status: false, message: 'Invalid credentials'});
      return {status: false, error: 'Invalid credentials'};
    }
    this.eventsGateway.broadcast({status: true, message: 'Correct credentials'});
    return {status: true, message: 'Correct credentials'};
  }
}
