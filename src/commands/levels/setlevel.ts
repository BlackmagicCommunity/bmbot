import { MessageEmbed, User as DUser } from 'discord.js';
import { Client, Command, RunArgumentsOptions } from '../../util';
import { User } from '../../util/typings/typings';
import { Levels } from '../../util/database';

export default class RankCommand extends Command {
  constructor(client: Client) {
    super(client, {
      help: "Set someone's xp.",
	  arguments: [{ name: 'user', type: 'User', required: true }, {name: 'level', type: 'Number', required: true }],
    });
  }

  public async main({ msg, args }: RunArgumentsOptions) {
	const level = Number(args[1]);
	if(isNaN(level)) return msg.channel.send(':x: Level is not a Number.');
	const user = await this.client.util.getUser(msg, args[0]) as User;
	user.level = level;
	user.xp = 0;
	for(let i = 0; i<user.level - 1; i++) user.xp += Levels.exp(level);
	user.remainingXp = Levels.exp(user.level);
	user.currentXp = 0;
	if(!user.messageCount) user.messageCount = 0;

	this.client.database.levels.updateUser(user).then(() => msg.react('✅')).catch(() => msg.react('❌'));
  }
}
