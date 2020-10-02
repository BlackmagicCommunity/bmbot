import { MessageEmbed } from 'discord.js';
import { Client, Command, RunArgumentsOptions } from '../../util';

export default class RolesCommand extends Command {
  constructor(client: Client) {
    super(client, {
      help: 'Shows level roles',
      aliases: ['levelroles'],
    });
  }

  public async main({ msg, args }: RunArgumentsOptions) {
    const dbRoles = await this.client.database.levels.getRolesFromLevel(-1);
    const guildRoles = (await msg.guild.roles.fetch()).cache;
    let text = '';
    dbRoles.forEach((r) => {
      const role = guildRoles.get(r.id);
      if (role) text += `\`${role.name}\` - level ${r.level}\n`;
    });

    const embed = new MessageEmbed().setColor(this.client.settings.colors.info).setDescription(text);

    msg.channel.send(embed);
  }
}
