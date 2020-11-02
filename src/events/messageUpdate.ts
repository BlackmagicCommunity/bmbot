import { Message } from 'discord.js';
import { Client, Event } from '../util';

export default class MessageUpdateEvent extends Event {
  constructor(client: Client) {
    super(client);
  }

  public main(oldMessage: Message, newMessage: Message): any {
    if (newMessage.author.bot) return;
    if (oldMessage.content === newMessage.content) return; // no need to log when the message doesn't change
    this.client.emit('message', newMessage);
    this.client.logger.message(newMessage, 'Message Update', oldMessage);
  }
}
