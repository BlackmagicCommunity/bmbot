import { MessageEmbed, TextChannel } from 'discord.js';
import { Client, Command, RunArgumentsOptions } from '../../util';

const map = [...Array(9)].map(
  (_, i) => i,
).map((n) => (n + 1).toString() + String.fromCharCode(65039, 8419));

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
      help: "Returns the server's rule(s) info.",
      guildOnly: true,
      optionsData: [{
        name: 'rule', description: 'Rule number.', type: 'INTEGER',
      }],
    });
  }

  public async main({ guild, args }: RunArgumentsOptions) {
    const embed = new MessageEmbed()
      .setColor(this.client.settings.colors.info)
      .setTitle(`${guild.name} - Rules`);

    const channel = guild.channels.cache
      .get(this.client.settings.channels.rules) as TextChannel;
    const { content } = await channel.messages.fetch(this.client.settings.messages.rules);

    if (args.length === 0) {
      embed.setDescription(content.substring(content.indexOf(map[0]), content.indexOf('https')));
    } else if (['0', '♾️', '∞'].includes(args[0])) {
    // special role shh
      embed.setDescription(':zero: Tim and the Staff can do whatever the hell.');
    } else {
      try {
        const key = content.indexOf(map[parseInt(args[0], 10) - 1]);
        let next = content.indexOf(map[parseInt(args[0], 10)]);
        if (key === -1) throw new Error(`Unknown rule. Use \`${this.client.settings.prefixes[0]}rules\``);
        if (next === -1) next = content.indexOf('http');
        embed.setDescription(content.substring(key, next).trim());
      } catch (err) {
        throw new Error(err?.message || 'The parameter you specified is not a number.');
      }
    }

    return { embeds: [embed] };
  }
}
