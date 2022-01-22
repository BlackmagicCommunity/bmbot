import { MessageEmbed } from 'discord.js';
import { Client, Command, RunArgumentsOptions } from '../../util';

export default class UserInfoCommand extends Command {
  constructor(client: Client) {
    super(client, {
      aliases: ['u', 'uinfo', 'userinfo'],
      help: 'Gets userinfo.',
      arguments: [{ name: 'member', type: 'Member' }],
      allowedRoles: ['staff'],
      guildOnly: true,
      optionsData: [{
        name: 'user', type: 'USER', description: 'User to see info about.', required: false,
      }],
    });
  }

  public async main({ msg, args }: RunArgumentsOptions) {
    let m = msg.member;
    if (args[0]) {
      m = await this.client.util.getMember(msg, args.join(' '));
      if (!m) throw new Error(`Could not find member \`${args.join(' ')}\`.`);
    }

    const roles = m.roles.cache
      .filter((x) => x.name !== '@everyone')
      .map((x) => `- ${x.name}`)
      .join('\n');

    if (m) {
      const embed = new MessageEmbed()
        .setTitle(`${m.user.tag}${m.user.bot ? ' [BOT]' : m.user.system ? ' [SYSTEM]' : ''}`)
        .setColor(m.displayColor)
        .setImage(`https://cdn.discordapp.com/avatars/${m.user.id}/${m.user.avatar}.png?size=1024`)
        .setFooter(m.user.id)
        .addField('Name', `${m.displayName} (\`${m.displayHexColor}\`)`, true)
        // eslint-disable-next-line no-bitwise
        .addField('Joined', `<t:${~~(m.joinedTimestamp / 1000)}:R>`, true)
        // eslint-disable-next-line no-bitwise
        .addField('Created', `<t:${~~(m.user.createdTimestamp / 1000)}:R>`, true);
      if (roles.length !== 0) {
        embed.addField(
          'Roles',
          m.roles.cache
            .filter((x) => x.name !== '@everyone')
            .map((x) => `- ${x}`)
            .join('\n'),
          true,
        );
      }

      // eslint-disable-next-line max-len
      // embed.addFieldreturn('Status', `${m.user.presence.status}\n${m.user.presence.activities.slice(0, 1).map((x) => `${x.state}`)}`, true);
      return { embeds: [embed] };
    }

    throw new Error(`Cannot find ${args[0]}`);
  }
}
