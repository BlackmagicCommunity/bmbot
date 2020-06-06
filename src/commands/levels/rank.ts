import { MessageEmbed, User as DUser } from 'discord.js';
import { Client, Command, RunArgumentsOptions } from '../../util';

export default class RankCommand extends Command {
  constructor(client: Client) {
    super(client, {
      help: "Check yours or someone's rank.",
      aliases: ['level'],
      arguments: [{ name: 'user', type: 'User' }],
    });
  }

  public async main({ msg, args }: RunArgumentsOptions) {
    let user: DUser;
    if (!args[0]) user = msg.author;
    else user = (await this.client.util.getUser(msg, args.join(' '))) || msg.author;

    const data = await this.client.database.levels.getUser(user.id);
    if (!data) return msg.channel.send(':x: User has no rank.');
    msg.channel.send(
      new MessageEmbed()
        .setThumbnail(user.displayAvatarURL())
        .setColor(process.env.DEFAULTCOLOR)
        .addField('Level', data.level, true)
        .addField(
          'XP (remaining)',
          `${this.client.database.levels.formatXp(data.xp)} (${this.client.database.levels.formatXp(data.remainingXp)})`,
          true
        )
        .addField('Message Count', data.messageCount)
    );
  }
}
