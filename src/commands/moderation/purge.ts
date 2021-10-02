import { Collection, Message, User } from 'discord.js';
import { Client, Command, RunArgumentsOptions } from '../../util';

export default class PurgeCommand extends Command {
  constructor(client: Client) {
    super(client, {
      help: 'Bulk delete messages.',
      aliases: ['prune', 'clear', 'delete'],
      guildOnly: true,
      requiredPermissions: ['MANAGE_MESSAGES'],
      arguments: [
        {
          name: 'amount',
          type: 'Number',
        },
        {
          name: 'member',
          type: 'Member',
        },
      ],
      optionsData: [
        {
          name: 'amount', description: 'Amount of messages to delete.', type: 'INTEGER', required: true,
        },
        { name: 'user', description: 'User to delete the messages from.', type: 'USER' },
      ],
    });
  }

  public async main({ msg, args }: RunArgumentsOptions) {
    if (msg.channel.type !== 'GUILD_TEXT') return;
    const amount = Math.min(10000, Math.max(0, parseInt(args.shift(), 10) + 1));
    let user: User = null;
    let messages: Collection<string, Message>;
    if (args[0]) {
      user = await this.client.util.getUser(msg, args.join(' '));
      messages = (await msg.channel.messages
        .fetch({ limit: amount })).filter((m) => m.author.id === user.id);
    }

    const { size } = await msg.channel.bulkDelete(user ? messages : amount, true);
    return `Deleted \`${size}\` messages.\nRemember bulk only deletes messages younger than 2 weeks.`;
  }
}
