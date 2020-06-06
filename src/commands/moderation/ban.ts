import { Client, Command, RunArgumentsOptions } from '../../util';

export default class BanCommand extends Command {
  constructor(client: Client) {
    super(client, {
      help: 'Ban someone.',
      requiredPermissions: ['BAN_MEMBERS'],
      guildOnly: true,
      arguments: [
        { name: 'member', type: 'Member', required: true },
        { name: 'reason', type: 'string' },
      ],
    });
  }

  public async main({ msg, args, guild }: RunArgumentsOptions) {
    const member = await this.client.util.getMember(msg, args[0]);
    if (!member) return msg.channel.send(':x: Member not found.');

    if (member.roles.highest.position > guild.me.roles.highest.position) return msg.channel.send(':x: Can not ban user that is above me.');
    if (member.roles.highest.position > msg.member.roles.highest.position) return msg.channel.send(':x: Can not ban user that is above you.');

    member
      .ban({
        days: 7,
        reason: `Banned by ${msg.author.tag} ${args[1] ? `: ${args[1]}` : ''}`,
      })
      .then(() => msg.react('✅'));
  }
}
