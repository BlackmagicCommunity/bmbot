import { Client, Event, Message } from '../util';

export default class MessageUpdateEvent extends Event {
  constructor(client: Client) {
    super(client, {
      disabled: false,
    });
  }

  main(oldMessage: Message, newMessage: Message): any {
    if (newMessage.author.bot) return;
    this.client.emit('message', newMessage);
    if (oldMessage.embeds.length !== newMessage.embeds.length) return; // no need to log when a link resolves to an embed
    this.client.logger.message(newMessage, 'Message Update', oldMessage);
  }
}
