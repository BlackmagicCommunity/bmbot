import { Collection, Message, Snowflake, TextChannel } from 'discord.js';
import { Client, Event, Level, RunArguments } from '../util';
import { Levels } from '../util/database';

export default class MessageEvent extends Event {
  private readonly levelCooldown = new Collection<Snowflake, number>();

  constructor(client: Client) {
    super(client);
  }

  public async main(message: Message): Promise<any> {
    if (message.author.bot) return;
    if (message.guild && !(message.channel as TextChannel).permissionsFor(message.guild.me).has('SEND_MESSAGES')) return;

    // handle leveling
    if (!message.editedAt || !message.guild) {
      if (!this.levelCooldown.has(message.author.id) || this.levelCooldown.get(message.author.id) < Date.now()) {
        const xp = Math.floor(Math.random() * (25 - 15 + 1) + 15);
        if (!message.author.data) await message.author.fetchData();
        let data = message.author.data;
        if (!data) data = { currentXp: 0, level: 0, msgCount: 0, totalXp: 0 };
        data.currentXp += xp;
        const diff = data.currentXp - Levels.exp(data.level);
        if (diff >= 0) {
          data.level++;
          data.currentXp = diff;

          if (!message.member.roles.cache.has(this.client.settings.roles.private))
            message.channel.send(
              this.client.settings.messages.levelUp.replace(/%mention%/g, message.author.toString()).replace(/%level%/g, data.level.toString())
            );
          if (message.guild.me.hasPermission('MANAGE_ROLES')) {
            const roles = await this.client.database.levels.getRolesFromLevel(data.level);
            const higher = roles.first();
            if (higher && !message.member.roles.cache.has(higher.id)) {
              if (higher.single)
                await message.member.roles.set(
                  message.member.roles.cache.filter((r) => !roles.has(r.id)),
                  'LevelUP - Single Role'
                );
              await message.member.roles.add(higher.id, 'LevelUP - Add Role');
            }
          }
        }

        data.msgCount++;
        data.totalXp += xp;

        await message.author.commitData(data);
        this.levelCooldown.set(message.author.id, Date.now() + 60000);
      }
    }

    const commandPrefix = this.client.settings.prefix;
    const prefix = new RegExp(`<@!?${this.client.user.id}> |^${this.regExpEsc(commandPrefix)}`).exec(message.content);
    if (!prefix) return;
    message.prefix = commandPrefix;
    const args = message.content
      .slice(prefix[0].length)
      .trim()
      .match(/("[^"]*")|[^ ]+/g)
      .map((a: string) => {
        if (a[0] === '"' && a[a.length - 1]) return a.slice(1, -1);
        return a;
      }) as string[];
    const command = this.client.commands.get(args.shift().toLowerCase());
    if (!command) return;
    message.command = command;
    const commandArguments = RunArguments(message, args);
    try {
      await command.handleCommand(commandArguments);
    } catch (e) {
      console.log(e);
    }
  }

  private regExpEsc(str: string) {
    return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  }
}
