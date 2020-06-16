import { MessageEmbed, User as DUser } from 'discord.js';
import { Client, Command, RunArgumentsOptions, Level } from '../../util';

export default class RankCommand extends Command {
  constructor(client: Client) {
    super(client, {
      help: "Check yours or someone's rank.",
      aliases: ['level'],
      arguments: [{ name: 'user', type: 'User' }],
      cooldown: 2,
    });
  }

  public async main({ msg, args }: RunArgumentsOptions) {
    let user: DUser;
    if (!args[0]) user = msg.author;
    else user = (await this.client.util.getUser(msg, args[0])) || msg.author;

    const rank =
      (await this.client.database.levels.getUsers())
        .sort((a: Level, b: Level) => {
          if (a.totalXp < b.totalXp) return 1;
          else if (a.totalXp > b.totalXp) return -1;
          else return 0;
        })
        .array()
        .findIndex((u) => u.userId === user.id) + 1;

    const data = await this.client.database.levels.getUser(user.id);
    if (!data) return msg.channel.send(':x: User has no rank.');
    msg.channel.send(
      new MessageEmbed()
        .setThumbnail(user.displayAvatarURL())
        .setColor(process.env.DEFAULTCOLOR)
        .addField('Rank', rank, true)
        .addField('Level', data.level, true)
        .addField('\u200b', '\u200b', true)
        .addField(
          'XP (current/remaining)',
          `${this.client.util.formatNumber(data.totalXp)} (${this.client.util.formatNumber(data.currentXp)}/${this.client.util.formatNumber(data.remainingXp)})`,
          true
        )
        .addField('Message Count', this.client.util.formatNumber(data.messageCount), true)
    );
  }
}
