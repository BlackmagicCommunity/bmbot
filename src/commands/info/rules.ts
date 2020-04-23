import { Client, Command, RunArgumentsOptions } from '../../util'
import { MessageEmbed, TextChannel } from 'discord.js';

const map = [...Array(9)].map((_, i) => i).map(n => (n + 1).toString() + String.fromCharCode(65039, 8419));

export default class PingCommand extends Command {
  constructor(client: Client) {
    super(client, {
        arguments: [{
            all: true,
            name: 'rule',
            type: 'number',
          }],
        aliases: ['rule'],
        help: 'Returns a given rule'
    });
  }

  public async main({ msg, args}: RunArgumentsOptions) {
    const embed = new MessageEmbed()
    .setTitle('Blackmagic Community - Rules')
    .setColor(process.env.DEFAULTCOLOR);

    const channel: TextChannel = msg.guild.channels.cache.get('701865087442616380') as TextChannel;
    const msgs = await channel.messages.fetch();
    const content = msgs.first().content;
    
    if(args.length === 0) {
        embed.setDescription(content.substring(content.indexOf(map[0]), content.indexOf('https')));
    } else {
      try
      {
        const key = map[parseInt(args[0])-1];
        const next = map[parseInt(args[0])];
        if(typeof key === 'undefined')
          return msg.send(':x: Invalid rule.');

        const res = content.substring(content.indexOf(key), content.indexOf(next)).trim();
        if(res === "")
          return msg.send(':x: Invalid rule.');
        embed.setDescription(res);
      } catch {
        msg.send(':x: The parameter you specified is not a number.');
        return;
      }
    }

    msg.send(embed);
  }
}