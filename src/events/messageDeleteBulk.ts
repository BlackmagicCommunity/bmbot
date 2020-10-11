import { Collection, Message, Snowflake } from 'discord.js';
import { Client, Event } from '../util';

export default class MessageDeleteBulkEvent extends Event {
  constructor(client: Client) {
    super(client);
  }

  public main(messages: Collection<Snowflake, Message>): any {
    this.client.logger.message(messages, 'Message Bulk Delete');
  }
}
