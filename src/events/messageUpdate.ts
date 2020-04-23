import { Client, Event, Message } from '../util';

export default class MessageUpdateEvent extends Event {
  constructor(client: Client) {
    super(client, {
      disabled: false,
    });
  }

  main(oldMessage: Message, newMessage: Message): any {
    this.client.emit('message', newMessage);
  }
}
