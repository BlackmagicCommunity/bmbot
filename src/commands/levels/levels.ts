import {
  Interaction,
  MessageActionRow, MessageButton, MessageEmbed, User,
} from 'discord.js';
import { UserData } from '../../util/typings/typings';
import { Client, Command, RunArgumentsOptions } from '../../util';

const getPage = (req: number, chunks: number) => Math.min(Math.max(req, 1), chunks) || 1;

const buildComponents = (page: number, chunks: number) => new MessageActionRow()
  .addComponents([
    new MessageButton()
      .setCustomId('start')
      .setEmoji('⏮️')
      .setStyle('PRIMARY')
      .setDisabled(page === 1),
    new MessageButton()
      .setCustomId('previous')
      .setEmoji('⬅️')
      .setStyle('PRIMARY')
      .setDisabled(page === 1),
    new MessageButton()
      .setCustomId('next')
      .setEmoji('➡️')
      .setStyle('PRIMARY')
      .setDisabled(page === chunks),
    new MessageButton()
      .setCustomId('last')
      .setEmoji('⏭️')
      .setStyle('PRIMARY')
      .setDisabled(page === chunks),
  ]);

export default class LeaderboardCommand extends Command {
  constructor(client: Client) {
    super(client, {
      help: 'Check the leaderboard.',
      aliases: ['leaderboard', 'ranks', 'top'],
      arguments: [{ name: 'page', type: 'Number' }],
      cooldown: 5,
      optionsData: [{ name: 'page', description: 'Page to view.', type: 'INTEGER' }],
    });
  }

  private async getPageData(page: number) {
    const leaderboard = await this.client.database.levels.fetchLeaderboard(page);
    if (!leaderboard.length) throw new Error(`No data for page ${page + 1}.`);

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

    return { leaderboard, lengthName, lengthXp };
  }

  private buildEmbed(page: number,
    member: {rank: number, avatar: string},
    data: { leaderboard: UserData[], lengthName: number, lengthXp: number}) {
    return {
      embeds: [
        new MessageEmbed()
          .setColor(this.client.settings.colors.info)
          .setDescription(
            `\`\`\`yaml\n${data.leaderboard
              .map((u, i) => {
                const user = this.client.users.cache.get(u.id);
                return `${(page * 10 + (i + 1))
                  .toString()
                  .padStart(data.leaderboard[data.leaderboard.length - 1].level.toString().length)}: ${user.username
                  .substr(0, data.lengthName)
                  .padStart(data.lengthName)}#${user.discriminator} - level ${u.level
                  .toString()
                  .padStart(data.leaderboard[0].level.toString().length)} - ${this.client.util.formatNumber(u.totalXp).padStart(data.lengthXp)} xp`;
              })
              .join('\n')}\n\`\`\``,
          )
          .setFooter(`Your rank: ${member.rank}`, member.avatar),
      ],
    };
  }

  // TODO implement button pages
  public async main({ msg, args }: RunArgumentsOptions) {
    const interaction = msg instanceof Interaction ? msg : null;
    let page = 0;
    if (args[0]) {
      const tmp = parseInt(args[0], 10) - 1;
      if (!Number.isNaN(tmp)) page = Math.max(0, tmp);
    }

    const rank = await this.client.database.levels.getUserRank(msg.member.id);
    const avatar = (msg.member.user as User).displayAvatarURL();

    try {
      interaction.repl;
      const pageData = await this.getPageData(page);
      return this.buildEmbed(page, { rank, avatar }, pageData);
    } catch (err) {

    }
  }
}
