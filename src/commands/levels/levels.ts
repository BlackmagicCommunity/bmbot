import { Client, Command, RunArgumentsOptions, Level } from '../../util';

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
    const users: Level[] = (await this.client.database.levels.getUsers())
      .sort((a: Level, b: Level) => {
        if (a.totalXp < b.totalXp) return 1;
        else if (a.totalXp > b.totalXp) return -1;
        else return 0;
      })
      .array();

    if (users.length === 0) return msg.channel.send(':x: No users have ranks.');
    const userRank = users.findIndex((u) => u.userId === msg.author.id) + 1;

    const parts: Level[][] = [];
    while (users.length > 0) parts.push(users.splice(0, 10));
    const page = Math.min(Math.max(Number(args[0]) || 1, 1), parts.length);

    const lengthNameArray = await Promise.all(
      parts[page - 1].map(async (u) => {
        const usr = (await this.client.users.fetch(u.userId).catch((_) => null))
        return usr.username.length;
      })
    );
    const lengthName = Math.max(...lengthNameArray);
    const lengthXp = Math.max(...parts[page - 1].map((u) => this.client.util.formatNumber(parts[page - 1][0].totalXp).length));

    msg.channel.send(
      `${parts[page - 1]
        .map((u, i) => {
          return `${((page - 1) * 10 + (i + 1))
            .toString()
            .padStart(parts[page - 1][parts[page - 1].length - 1].level.toString().length)}: ${this.client.users.cache
            .get(u.userId)
            .username.substr(0, lengthName)
            .padStart(lengthName)}#${this.client.users.cache.get(u.userId).discriminator} - level ${u.level
            .toString()
            .padStart(parts[page - 1][0].level.toString().length)} - ${this.client.util.formatNumber(u.totalXp).padStart(lengthXp)} xp`;
        })
        .join('\n')}\n\nYour rank: ${userRank}\nPage ${page}/${parts.length}`,
      { code: 'yaml' }
    );
  }
}
