import { MessageEmbed, User } from 'discord.js';
import { Client, Command, Level, RunArgumentsOptions } from '../../util';
import { Levels } from '../../util/database';

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
    let user: User;
    if (!args[0]) user = await msg.author.fetchData();
    else {
      user = await this.client.util.getUser(msg, args.join(' '));
      if (!user) return msg.channel.send(':x: User not found.');
      user = await user.fetchData();
    }

    if (!user.data?.totalXp) return msg.channel.send(':x: User has no rank.');

    const rank = await this.client.database.levels.getUserRank(user.id);
    const requiredXp = Levels.exp(user.data.level);
    msg.channel.send(
      new MessageEmbed()
        .setThumbnail(user.displayAvatarURL())
        .setColor(this.client.settings.colors.info)
        .addField('Rank', rank, true)
        .addField('Level', user.data.level, true)
        .addField('\u200b', '\u200b', true)
        .addField(
          'XP (current/required)',
          `${this.client.util.formatNumber(user.data.totalXp)} (${this.client.util.formatNumber(user.data.currentXp)}/${this.client.util.formatNumber(
            requiredXp
          )})`,
          true
        )
        .addField('Message Count', this.client.util.formatNumber(user.data.msgCount), true)
    );
  }
}
