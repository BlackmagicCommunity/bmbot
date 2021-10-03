import { MessageEmbed, User } from 'discord.js';
import { Client, Command, RunArgumentsOptions } from '../../util';
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
    if (!args[0]) user = msg.author;
    else {
      user = await this.client.util.getUser(msg, args.join(' '));
      if (!user) throw new Error('User not found.');
    }

    const userData = await this.client.userSettings.fetchData(user.id);

    if (!userData?.totalXp) throw new Error('User has no rank.');

    const rank = await this.client.database.levels.getUserRank(user.id);
    const requiredXp = Levels.exp(userData.level);
    return {
      embeds: [
        new MessageEmbed()
          .setThumbnail(user.displayAvatarURL())
          .setColor(this.client.settings.colors.info)
          .addField('Rank', rank, true)
          .addField('Level', userData.level.toString(), true)
          .addField('\u200b', '\u200b', true)
          .addField(
            'XP (current/required)',
            `${this.client.util.formatNumber(userData.totalXp)} (${this.client.util.formatNumber(userData.currentXp)}/${this.client.util.formatNumber(
              requiredXp,
            )})`,
            true,
          )
          .addField('Message Count', this.client.util.formatNumber(userData.msgCount), true),
      ],
    };
  }
}
