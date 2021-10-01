import {
  Collection, Message, MessageEmbed, Snowflake, TextChannel,
} from 'discord.js';
import {
  Event, RunArguments,
} from '../util';
import { Levels } from '../util/database';

export default class MessageEvent extends Event {
  private readonly levelCooldown = new Collection<Snowflake, number>();

  private async handleLeveling(message: Message) {
    if (!this.levelCooldown.has(message.author.id)
     || this.levelCooldown.get(message.author.id) < Date.now()) {
      const xp = Math.floor(Math.random() * (25 - 15 + 1) + 15);
      let data = await this.client.userSettings.fetchData(message.author.id);
      if (!data) {
        data = {
          totalXp: 0,
          level: 0,
          msgCount: 0,
          currentXp: 0,
        };
      }

      data.msgCount++;
      data.totalXp += xp;
      data.currentXp += xp;

      const diff = data.currentXp - Levels.exp(data.level);
      if (diff >= 0) {
        data.level++;
        data.currentXp = 0;

        // don't send to the "DND" ones
        if (!message.member.roles.cache.has(this.client.settings.roles.private)) {
          message.channel.send(
            this.client.settings.messages.levelUp.replace(/%mention%/g, message.author.toString()).replace(/%level%/g, data.level.toString()),
          );
        }

        if (message.guild.me.permissions.has('MANAGE_ROLES')) {
          // check roles
          const roles = await this.client.database.levels.getRolesFromLevel(data.level);
          const higher = roles.first();
          if (higher && !message.member.roles.cache.has(higher.id)) {
            if (higher.single) {
              await message.member.roles.set(
                message.member.roles.cache.filter((r) => !roles.has(r.id)),
                'LevelUP - Single Role',
              );
            }
            await message.member.roles.add(higher.id, 'LevelUP - Add Role');
          }
        }
      }

      // update db & cooldown
      await this.client.userSettings.commitData(message.author.id, data);
      this.levelCooldown.set(message.author.id, Date.now() + 60000);
    }
  }

  public async main(message: Message): Promise<any> {
    if (message.author.bot) return;
    if (message.guild && !(message.channel as TextChannel).permissionsFor(message.guild.me).has('SEND_MESSAGES')) return;

    if (!message.editedAt) await this.handleLeveling(message);

    const prefix = new RegExp(`^${this.client.settings.prefixes.join('|^')}`).exec(message.content);
    if (!prefix) return;

    const matched = message.content
      .slice(prefix[0].length)
      .trim()
      .match(/("[^"]*")|[^ ]+/g);
    if (!matched) return;

    const args = matched.map((a: string) => {
      if (a[0] === '"' && a[a.length - 1]) return a.slice(1, -1);
      return a;
    });
    const cmd = args.shift().toLowerCase();
    const command = this.client.commands.get(cmd);
    // handle tag
    if (!command) {
      const tag = await this.client.database.tags.getTag(cmd);
      if (tag) message.channel.send(tag.reply);
      return;
    }

    // eslint-disable-next-line no-param-reassign
    const commandArguments = RunArguments(message, args);
    try {
      const res = await command.handleCommand(commandArguments);
      if (res) return message.reply(res);
    } catch (err) {
      this.client.logger.error('Message Event', err.message);
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(this.client.settings.colors.danger)
          .setDescription(err.message),
        ],
      });
    }
  }
}
