import { Guild, User } from 'discord.js';
import { Client, Event } from '../util';

export default class GuildBanRemoveEvent extends Event {
  constructor(client: Client) {
    super(client, {
      disabled: false,
    });
  }

  main(guild: Guild, user: User): any {
    setTimeout(async () => {
      // get reason + mod from audit logs, needs time
      let { entries } = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_REMOVE' });
      entries = entries.filter((e) => (e.target as User).id === user.id);
      const entry = entries.first();
      this.client.logger.infraction('Member Unban', entry.reason, entry.executor, entry.target as User);
    }, 1000);
  }
}
