import DateFormat from 'dateformat';
import { MessageEmbed } from 'discord.js';
import { Client, Command, RunArgumentsOptions } from '../../util';

export default class EvalCommand extends Command {
  constructor(client: Client) {
    super(client, {
      aliases: ['u'],
      help: 'Gets userinfo',
      arguments: [{ name: 'member', type: 'Member' }],
    });
  }

  public async main({ msg, args }: RunArgumentsOptions) {
    let m = msg.member;
    if (args.length !== 0) {
      m = await this.client.util.getMember(msg, args.join(' '));
      if (m === undefined) return msg.channel.send(`:x: Could not find member \`${args.join(' ')}\`.`);
    }

    const roles = m.roles.cache
      .filter((x) => x.name !== '@everyone')
      .map((x) => `- ${x.name}`)
      .join('\n');

    if (m) {
      const embed = new MessageEmbed()
        .setTitle(`User: ${m.user.tag} ${m.user.bot ? '[BOT]' : m.user.system ? '[SYSTEM]' : ''}`)
        .setColor(m.displayColor)
        .setImage(`https://cdn.discordapp.com/avatars/${m.user.id}/${m.user.avatar}.png?size=1024`)
        .addField('Display Name', `${m.displayName} (\`${m.displayHexColor}\`)`, true)
        .addField('ID', `${m.user.id}`, true)
        .addField('Joined On', `${DateFormat(m.joinedTimestamp, 'yyyy-mm-dd h:MM TT')}`, true);
      if (roles.length !== 0)
        embed.addField(
          'Roles',
          m.roles.cache
            .filter((x) => x.name !== '@everyone')
            .map((x) => `- ${x.name}`)
            .join('\n'),
          true
        );
      embed.addField('Status', `${m.user.presence.status}\n${m.user.presence.activities.slice(0, 1).map((x) => `${x.state}`)}`, true);
      msg.channel.send(embed);
    } else {
      msg.channel.send('Cannot find ' + args[0]);
    }
  }
}
