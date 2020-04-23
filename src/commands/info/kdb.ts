import { MessageEmbed } from 'discord.js';
import { load, searchForArticle } from 'knowledge';
import { Client, Command, RunArgumentsOptions } from '../../util';

load('fusion', 'resolve');

export default class KnowledgeDatabaseLookup extends Command {
  constructor(client: Client) {
    super(client, {
      aliases: ['tip'],
      arguments: [
        {
          name: 'article',
          type: 'string',
          all: true,
          infinite: true,
          required: false,
        },
      ],
      help: 'does knowledge database magic',
    });
  }

  public async main({ msg, args }: RunArgumentsOptions) {
    const article = await searchForArticle(args.join(' ') ?? 'tips');
    if (!article) {
      msg.channel.send(':x: Coult not find that.');
    } else if (Array.isArray(article)) {
      msg.channel.send(`Multiple Entries Found:\n\n${article.map((x) => `- ${x.id}`).join('\n')}\n\nYou can specify a specific article to see.`);
    } else {
      const embed = new MessageEmbed() //
        .setTitle(article.title)
        .setDescription(article.content)
        .setFooter(`Entry by ${article.author}${article.created ? ` on ${article.created}` : ''} - id=${article.id}`);
      msg.channel.send(embed);
    }
  }
}
