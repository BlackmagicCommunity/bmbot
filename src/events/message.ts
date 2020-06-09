import { Collection, Snowflake, TextChannel } from 'discord.js';
import { Client, Event, Message, RunArguments } from '../util';
import { Levels } from '../util/database';
import { Role, User } from '../util/typings/typings';

export default class MessageEvent extends Event {
  private readonly levelCooldown = new Collection<Snowflake, number>();

  constructor(client: Client) {
    super(client, {
      disabled: false,
    });
  }

  public async main(message: Message): Promise<any> {
    if (message.author.bot) return;
    if (message.guild && !(message.channel as TextChannel).permissionsFor(message.guild.me).has('SEND_MESSAGES')) return;

    // handle xp
    if (!message.editedAt) {
      if (!this.levelCooldown.has(message.author.id) || this.levelCooldown.get(message.author.id) < Date.now()) {
        const xp = Math.floor(Math.random() * (25 - 15 + 1) + 15);
        let user = await this.client.database.levels.getUser(message.author.id);
        if (!user) {
          user = message.author as User;
          user.xp = 0;
          user.level = 0;
          user.remainingXp = Levels.exp(0);
          user.messageCount = 0;
          user.currentXp = 0;
        }

        user.messageCount++;
        user.xp += xp;
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
            let highest: Role;
            for (const [snow, role] of roles) {
              if (role.level <= user.level && (!highest || highest.level < role.level)) highest = role;
            }

            if (highest && highest.single) {
              roles.forEach((r) => message.member.roles.remove(r.id, 'Levels - Single Role'));
              message.member.roles.add(highest.id, 'Levels - Level Up');
            } else roles.forEach((r) => message.member.roles.add(r.id, 'Levels - Level Up'));
          }
        }

        // update db & cooldown
        this.client.database.levels.updateUser(user);
        this.levelCooldown.set(message.author.id, Date.now() + 60000);
      }
    }

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
