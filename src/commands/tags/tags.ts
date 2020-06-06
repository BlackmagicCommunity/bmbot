import { MessageEmbed } from 'discord.js';
import { Client, Command, RunArgumentsOptions, Tag } from '../../util';

export default class CreateTagCommand extends Command {
  constructor(client: Client) {
    super(client, {
      help: 'Lists all tags',
      arguments: [{ name: 'page', type: 'number' }],
    });
  }

  public async main({ msg, args }: RunArgumentsOptions) {
    const tags = (await this.client.database.tags.getTags()).array();
    if (tags.length === 0) return msg.channel.send(':x: No tags available.');
    const parts: Tag[][] = [];
    while (tags.length > 0) parts.push(tags.splice(0, 10));

    const page = Math.min(Math.max(Number(args[0]) || 1, 1), parts.length);
    msg.channel.send(
      new MessageEmbed()
        .setTitle('Tags')
        .setDescription(parts[page - 1].map((t) => `\`${t.trigger}\``).join('\n'))
        .setFooter(`Page ${page}/${parts.length}`)
    );
  }
}
