import { Message } from 'discord.js';
import { Event } from '../util';

export default class MessageUpdateEvent extends Event {
  public main(oldMessage: Message, newMessage: Message): any {
    if (newMessage.author.bot) return;
    // no need to log when the message doesn't change
    if (oldMessage.content === newMessage.content) return;
    this.client.emit('message', newMessage);
    this.client.logger.message(newMessage, 'Message Update', oldMessage);
  }
}
