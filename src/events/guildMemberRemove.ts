import { GuildMember } from 'discord.js';
import { Event } from '../util';

export default class MemberRemoveEvent extends Event {
  public main(member: GuildMember): any {
    this.client.logger.join(member, true);
  }
}
