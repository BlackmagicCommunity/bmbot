import { Collection, Message, Snowflake } from 'discord.js';
import { Event } from '../util';

export default class MessageDeleteBulkEvent extends Event {
  public main(messages: Collection<Snowflake, Message>): any {
    this.client.logger.message(messages, 'Message Bulk Delete');
  }
}
