import { MessageEmbed } from 'discord.js';
import { Client, Command, RunArgumentsOptions } from '../../util';

export default class LeaderboardCommand extends Command {
  constructor(client: Client) {
    super(client, {
      help: 'Check the leaderboard.',
      aliases: ['leaderboard', 'ranks', 'top'],
      arguments: [{ name: 'page', type: 'Number' }],
      cooldown: 5,
    });
  }

  public async main({ msg, args }: RunArgumentsOptions) {
    let page = 0;
    if (args[0]) {
      const tmp = parseInt(args[0], 10) - 1;
      if (!Number.isNaN(tmp)) page = Math.max(0, tmp);
    }

    const leaderboard = await this.client.database.levels.fetchLeaderboard(page);
    if (!leaderboard.length) throw new Error(`No data for page ${page + 1}.`);
    const userRank = await this.client.database.levels.getUserRank(msg.author.id);

    const lengthNameArray = await Promise.all(
      leaderboard.map(async (u) => {
        const usr = await this.client.users.fetch(u.id).catch(() => null);
        return usr.username.length;
      }),
    );
    const lengthName = Math.max(...lengthNameArray);
    const lengthXp = Math.max(...leaderboard.map(
      () => this.client.util.formatNumber(leaderboard[0].totalXp).length,
    ));

    return {
      embeds: [
        new MessageEmbed()
          .setColor(this.client.settings.colors.info)
          .setDescription(
            `\`\`\`yaml\n${leaderboard
              .map((u, i) => {
                const user = this.client.users.cache.get(u.id);
                return `${(page * 10 + (i + 1))
                  .toString()
                  .padStart(leaderboard[leaderboard.length - 1].level.toString().length)}: ${user.username
                  .substr(0, lengthName)
                  .padStart(lengthName)}#${user.discriminator} - level ${u.level
                  .toString()
                  .padStart(leaderboard[0].level.toString().length)} - ${this.client.util.formatNumber(u.totalXp).padStart(lengthXp)} xp`;
              })
              .join('\n')}\n\`\`\``,
          )
          .setFooter(`Your rank: ${userRank}`, msg.author.displayAvatarURL()),
      ],
    };
  }
}
