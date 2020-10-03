import { Collection, Snowflake, TextChannel } from 'discord.js';
import { Client, Event, Level, LevelRole, Message, RunArguments } from '../util';
import { Levels } from '../util/database';

export default class MessageEvent extends Event {
  private readonly levelCooldown = new Collection<Snowflake, number>();

  constructor(client: Client) {
    super(client, {
      disabled: false,
    });
  }

  private async handleLeveling(message: Message) {
    if (!this.levelCooldown.has(message.author.id) || this.levelCooldown.get(message.author.id) < Date.now()) {
      const xp = Math.floor(Math.random() * (25 - 15 + 1) + 15);
      let user = await this.client.database.levels.getUser(message.author.id);
      if (!user) {
        user = new Level(message.author.id);
        user.totalXp = 0;
        user.level = 0;
        user.remainingXp = Levels.exp(0);
        user.messageCount = 0;
        user.currentXp = 0;
      }

      user.messageCount++;
      user.totalXp += xp;
      user.remainingXp -= xp;
      user.currentXp += xp;

      // level up?
      if (user.remainingXp <= 0) {
        user.level++;
        user.remainingXp = Levels.exp(user.level);
        user.currentXp = 0;

        message.channel.send(process.env.LEVEL_UP.replace(/%mention%/g, message.author.toString()).replace(/%level%/g, user.level.toString()));

        if (message.guild.me.permissions.has('MANAGE_ROLES')) {
          // check roles
          const roles = await this.client.database.levels.getRoles(user.level);
          console.log(roles);
          let highest: LevelRole;
          for (const [snow, role] of roles) {
            if (role.level <= user.level && (!highest || highest.level < role.level)) highest = role;
          }

          if (highest && highest.single) {
            roles.forEach((r) => message.member.roles.remove(r.roleId, 'Levels - Single Role'));
            message.member.roles.add(highest.roleId, 'Levels - Level Up');
          } else roles.forEach((r) => message.member.roles.add(r.roleId, 'Levels - Level Up'));
        }
      }

      // update db & cooldown
      this.client.database.levels.updateUser(user);
      this.levelCooldown.set(message.author.id, Date.now() + 60000);
    }
  }

  public async main(message: Message): Promise<any> {
    if (message.author.bot) return;
    if (message.guild && !(message.channel as TextChannel).permissionsFor(message.guild.me).has('SEND_MESSAGES')) return;

    if (!message.editedAt) await this.handleLeveling(message);

    const commandPrefix = this.client.prefix;
    const prefix = new RegExp(`<@!?${this.client.user.id}> |^${this.regExpEsc(commandPrefix)}`).exec(message.content);
    if (!prefix) return;
    message.prefix = commandPrefix;
    const args = message.content
      .slice(prefix[0].length)
      .trim()
      .match(/("[^"]*")|[^ ]+/g)
      .map((a) => {
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
