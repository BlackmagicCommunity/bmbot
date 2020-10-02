import { Message } from 'discord.js';
import { Client, Event } from '../util';

export default class MessageDeleteEvent extends Event {
  constructor(client: Client) {
    super(client);
  }

  public main(message: Message): any {
    if (message.author.bot) return;
    this.client.logger.message(message, 'Message Delete');
  }
}
