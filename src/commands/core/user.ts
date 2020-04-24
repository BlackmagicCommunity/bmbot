import DateFormat from 'dateformat';
import { MessageEmbed } from 'discord.js';
import { Client, Command, RunArgumentsOptions } from '../../util';

export default class EvalCommand extends Command {
  constructor(client: Client) {
    super(client, {
      aliases: ['u'],
      help: 'Gets userinfo',
    });
  }

  public async main({ msg, guild, args }: RunArgumentsOptions) {
    if (!args[0] || !this.hasPermission(msg)) {
      args[0] = msg.author.id;
    }
    args[0] = args[0].replace(/<@!?([0-9]+)\>/, '$1');
    const m = await guild.members.fetch(args[0]);
    if (m) {
      msg.channel.send(
        new MessageEmbed()
          .setTitle(`User: ${m.user.tag} ${m.user.bot ? '[BOT]' : m.user.system ? '[SYSTEM]' : ''}`)
          .setColor(m.displayColor)
          .setImage(`https://cdn.discordapp.com/avatars/${m.user.id}/${m.user.avatar}.png?size=1024`)
          .addField('ID', `${m.user.id}`, true)
          .addField('Joined On', `${DateFormat(m.joinedTimestamp, 'yyyy-mm-dd h:MM TT')}`, true)
          .addField('Display Name', `${m.displayName} (\`${m.displayHexColor}\`)`, true)
          .addField(
            'Roles',
            m.roles.cache
              .filter((x) => x.name !== '@everyone')
              .map((x) => `- ${x.name}`)
              .join('\n'),
            true
          )
          .addField('Status', `${m.user.presence.status}\n${m.user.presence.activities.slice(0, 1).map((x) => `${x.state}`)}`, true)
      );
    } else {
      msg.channel.send('Cannot find ' + args[0]);
    }
  }
}
