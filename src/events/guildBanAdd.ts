import { Guild, User } from 'discord.js';
import { Client, Event } from '../util';

export default class GuildBanAddEvent extends Event {
  constructor(client: Client) {
    super(client);
  }

  public main(guild: Guild, user: User): any {
    setTimeout(async () => {
      // get reason + mod from audit logs, needs time
      let { entries } = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD' });
      entries = entries.filter((e) => (e.target as User).id === user.id);
      const entry = entries.first();
      this.client.logger.infraction('Member Ban', entry.reason, entry.executor, entry.target as User);
    }, 1000);
  }
}
