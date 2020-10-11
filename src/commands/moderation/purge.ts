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
    });
  }

  public async main({ msg, args }: RunArgumentsOptions) {
    const amount = Math.min(10000, Math.max(0, parseInt(args.shift()))) ?? 15;
    let user: User = null;
    let messages: Collection<string, Message>;
    if (args[0]) {
      user = await this.client.util.getUser(msg, args.join(' '));
      messages = (await msg.channel.messages.fetch({ limit: amount }, false)).filter((m) => m.author.id === user.id);
    }

    const { size } = await msg.channel.bulkDelete(user ? messages : amount, true);
    msg.channel.send(`Deleted \`${size}\` messages.\nRemember bulk only deletes messages younger than 2 weeks.`);
  }
}
