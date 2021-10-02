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
      optionsData: [
        {
          name: 'user', description: 'User to ban.', type: 'USER', required: true,
        },
        { name: 'reason', description: 'Reason for the ban.', type: 'STRING' },
      ],
    });
  }

  public async main({ msg, args, guild }: RunArgumentsOptions): Promise<null> {
    const member = await this.client.util.getMember(msg, args[0]);
    if (!member) throw new Error('Member not found.');

    if (member.roles.highest.position > guild.me.roles.highest.position) throw new Error('Can not ban user that is above me.');
    if (member.roles.highest.position > msg.member.roles.highest.position) throw new Error('Can not ban user that is above you.');

    await member
      .ban({
        days: 7,
        reason: `Banned by ${msg.author.tag} ${args[1] ? `: ${args[1]}` : ''}`,
      });
    msg.react('✅');
    return null;
  }
}
