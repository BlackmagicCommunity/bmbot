import { Collection, Snowflake } from 'discord.js';
import { Client, Event, Message } from '../util';

export default class MessageDeleteBulkEvent extends Event {
  constructor(client: Client) {
    super(client, {
      disabled: false,
    });
  }

  main(messages: Collection<Snowflake, Message>): any {
    this.client.logger.message(messages, 'Message Bulk Delete');
  }
}
