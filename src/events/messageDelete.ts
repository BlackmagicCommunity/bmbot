import { Message } from 'discord.js';
import { Event } from '../util';

export default class MessageDeleteEvent extends Event {
  public main(message: Message): any {
    if (message.author.bot) return;
    this.client.logger.message(message, 'Message Delete');
  }
}
