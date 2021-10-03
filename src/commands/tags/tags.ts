import { MessageEmbed, ReplyMessageOptions } from 'discord.js';
import {
  Client, Command, RunArgumentsOptions, Tag,
} from '../../util';

export default class CreateTagCommand extends Command {
  constructor(client: Client) {
    super(client, {
      help: 'Lists all tags',
      arguments: [{ name: 'page', type: 'number' }],
    });
  }

  public async main({ args }: RunArgumentsOptions) {
    const tags = Array.from((await this.client.database.tags.getTags())
      .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0)).values());
    if (tags.length === 0) throw new Error('No tags available.');
    const parts: Tag[][] = [];
    while (tags.length > 0) parts.push(tags.splice(0, 10));

    const page = Math.min(Math.max(Number(args[0]) || 1, 1), parts.length);
    const embed = new MessageEmbed().setTitle('Tags').setFooter(`Page ${page}/${parts.length}`);

    parts[page - 1].forEach((t) => {
      embed.addField(t.description, t.name);
    });

    return { embeds: [embed] } as ReplyMessageOptions;
  }
}
