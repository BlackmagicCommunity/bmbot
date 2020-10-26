import { Client, Command, RunArgumentsOptions } from '../../util';

export default class RoleCommand extends Command {
  constructor(client: Client) {
    super(client, {
      help: "Set a role's level to achieve.",
      requiredPermissions: ['MANAGE_ROLES'],
      arguments: [
        { name: 'role', type: 'Role', required: true },
        { name: 'level', type: 'Number', required: true },
        { name: 'single', type: 'Boolean' },
      ],
    });
  }

  public async main({ msg, args }: RunArgumentsOptions) {
    const role = await this.client.util.getRole(msg, args[0]);
    if (!role) return msg.channel.send(':x: Role not found.');
    const level = Number(args[1]);
    if (isNaN(level)) return msg.channel.send(":x: That's not a number.");
    const single = args[2] && ['y', 'yes', 't', 'true'].includes(args[2]);

    await role.commitData({ id: role.id, level, single });

    msg.channel.send(`Role \`${role.name}\` is now achieved at level \`${level}\`.\nIt ${single ? 'is' : "isn't"} single.`);
  }
}
