import { Client, Event, Message } from '../util';

export default class MessageDeleteEvent extends Event {
  constructor(client: Client) {
    super(client, {
      disabled: false,
    });
  }

  main(message: Message): any {
    this.client.logger.message(message, 'Message Delete');
  }
}
