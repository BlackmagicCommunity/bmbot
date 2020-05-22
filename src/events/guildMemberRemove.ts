import { GuildMember } from 'discord.js';
import { Client, Event } from '../util';

export default class MemberRemoveEvent extends Event {
  constructor(client: Client) {
    super(client, {
      disabled: false,
    });
  }

  main(member: GuildMember): any {
    this.client.logger.join(member, true);
  }
}
