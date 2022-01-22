import { MessageEmbed } from 'discord.js';
import { Client, Command, RunArgumentsOptions } from '../../util';
import { Levels } from '../../util/database';

export default class RankCommand extends Command {
  constructor(client: Client) {
    super(client, {
      help: "Check yours or someone's rank.",
      aliases: ['level'],
      arguments: [{ name: 'user', type: 'User' }],
      optionsData: [{ name: 'user', description: 'User to see the rank.', type: 'USER' }],
      cooldown: 2,
    });
  }

  public async main({ msg, args }: RunArgumentsOptions) {
    let m = msg.member;
    if (args[0]) {
      m = await this.client.util.getMember(msg, args.join(' '));
      if (!m) throw new Error(`Could not find member \`${args.join(' ')}\`.`);
    }

    const userData = await this.client.userSettings.fetchData(m.id);

    if (!userData?.totalXp) throw new Error('User has no rank.');

    const userRank = await this.client.database.levels.getUserRank(msg.member.id);
    const requiredXp = Levels.exp(userData.level);

    return {
      embeds: [
        new MessageEmbed()
          .setTitle(m.user.username)
          .setThumbnail(m.user.displayAvatarURL())
          .setColor(this.client.settings.colors.info)
          .addField('Rank', userRank?.toString() ?? 'unranked', true)
          .addField('Level', userData.level?.toString() || '0', true)
          .addField('\u200b', '\u200b', true)
          .addField(
            'XP (current/required)',
            `${this.client.util.formatNumber(userData.totalXp)} (${this.client.util.formatNumber(userData.currentXp)}/${this.client.util.formatNumber(
              requiredXp,
            )})`,
            true,
          )
          .addField('Message Count', this.client.util.formatNumber(userData.msgCount) || '0', true),
      ],
    };
  }
}
