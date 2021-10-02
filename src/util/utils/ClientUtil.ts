import {
  Guild, GuildChannel, GuildMember,
  Interaction,
  Message, Role, TextChannel, ThreadChannel, User,
} from 'discord.js';
import { Client } from '../core/Client';

export class ClientUtil {
  public client: Client;

  constructor(client: Client) {
    Object.defineProperty(this, 'client', { value: client });
  }

  public isOwner(id: string): boolean {
    return this.client.settings.owner === id;
  }

  public isDeveloper(id: string): boolean {
    return this.client.settings.developers.includes(id);
  }

  public formatNumber(value: number) {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  }

  public clean(text: string) {
    return text
      .replace(/`/g, `\`${String.fromCharCode(8203)}`)
      .replace(/@/g, `@${String.fromCharCode(8203)}`)
      .replace(new RegExp(`${this.client.token}`, 'g'), 'Token');
  }

  public async getUser(message: Message | Interaction, arg: string): Promise<User> {
    if (message instanceof Message
      && message.mentions.users.size !== 0) return message.mentions.users.first();
    if (/[0-9]{16,18}/.test(arg)) return this.client.users.fetch(arg);

    // eslint-disable-next-line no-param-reassign
    arg = arg.toLowerCase();
    if (/[a-zA-Z]{1,30}/.test(arg)) return (await message.guild.members.fetch()).find((member) => member.user.username.toLowerCase().includes(arg))?.user;
    return null;
  }

  public async getMember(message: Message | Interaction, arg: string): Promise<GuildMember> {
    const user = await this.getUser(message, arg);
    const member = await message.guild.members.fetch({ user });
    if (member) return member;
    return null;
  }

  public async getRole(message: Message | Interaction, arg: string): Promise<Role> {
    if (message instanceof Message
      && message.mentions.roles.size !== 0) return message.mentions.roles.first();
    if (/[0-9]{16,18}/.test(arg)) return message.guild.roles.fetch(arg);

    // eslint-disable-next-line no-param-reassign
    arg = arg.toLowerCase();
    if (/[a-zA-Z]{1,30}/.test(arg)) return message.guild.roles.cache.find((role: Role) => role.name.toLowerCase().includes(arg));
    return null;
  }

  public async getChannel(message: Message | Interaction, arg: string,
    textOnly: boolean = true): Promise<GuildChannel|ThreadChannel> {
    if (message instanceof Message
        && message.mentions.channels.size !== 0) {
      return message.mentions.channels.first() as TextChannel;
    }

    if (/[0-9]{16,18}/.test(arg)) return message.guild.channels.cache.get(arg) as GuildChannel;

    // eslint-disable-next-line no-param-reassign
    arg = arg.toLowerCase();
    if (/[a-zA-Z]{1,30}/.test(arg)) {
      return message.guild.channels.cache
        .find((channel) => {
          if (textOnly && channel.type !== 'GUILD_TEXT') return false;
          return channel.name.toLowerCase().includes(arg);
        });
    }
    return null;
  }

  public async getGuild(arg: string): Promise<Guild> {
    if (/[0-9]{16,18}/.test(arg)) return this.client.guilds.cache.get(arg);

    // eslint-disable-next-line no-param-reassign
    arg = arg.toLowerCase();
    if (/[a-zA-Z]{1,30}/.test(arg)) return this.client.guilds.cache.find((guild) => guild.name.toLowerCase().includes(arg));
    return null;
  }
}
