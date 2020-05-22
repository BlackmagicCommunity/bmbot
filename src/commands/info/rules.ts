import { MessageEmbed, TextChannel } from 'discord.js';
import { Client, Command, RunArgumentsOptions } from '../../util';

const map = [...Array(9)].map((_, i) => i).map((n) => (n + 1).toString() + String.fromCharCode(65039, 8419));

export default class RulesCommand extends Command {
  constructor(client: Client) {
    super(client, {
      arguments: [
        {
          all: true,
          name: 'rule',
          type: 'number',
        },
      ],
      aliases: ['rule'],
      help: "Returns the server's rule(s) info",
    });
  }

  public async main({ msg, args }: RunArgumentsOptions) {
    const embed = new MessageEmbed().setColor(process.env.DEFAULTCOLOR).setTitle('Blackmagic Community - Rules');

    const channel = msg.guild.channels.cache.get(process.env.RULES_CHANNEL) as TextChannel;
    const { content } = await channel.messages.fetch(process.env.RULES_MESSAGE);

    if (args.length === 0) {
      embed.setDescription(content.substring(content.indexOf(map[0]), content.indexOf('https')));
    } else {
      try {
        const key = content.indexOf(map[parseInt(args[0]) - 1]);
        let next = content.indexOf(map[parseInt(args[0])]);
        if (key === -1) return msg.channel.send(':x: Invalid rule.');
        if (next === -1) next = content.indexOf('http');
        embed.setDescription(content.substring(key, next).trim());
      } catch {
        msg.channel.send(':x: The parameter you specified is not a number.');
        return;
      }
    }

    msg.channel.send(embed);
  }
}
