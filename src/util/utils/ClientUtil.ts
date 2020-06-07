import { Channel, Guild, GuildChannel, GuildMember, Role, TextChannel, User, VoiceChannel } from 'discord.js';
import { Client } from '../core/Client';
import { Message } from '../typings/typings';

export class ClientUtil {
  public client: Client;

  constructor(client: Client) {
    Object.defineProperty(this, 'client', { value: client });
  }

  public isOwner(id: string): boolean {
    return process.env.OWNER.includes(id);
  }

  public isDeveloper(id: string): boolean {
    return process.env.DEVELOPER.includes(id);
  }

  public formatThousand(xp: number) {
    if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
    return xp.toString();
  }

  public clean(text: string) {
    return text
      .replace(/`/g, `\`${String.fromCharCode(8203)}`)
      .replace(/@/g, `@${String.fromCharCode(8203)}`)
      .replace(new RegExp(`${this.client.token}`, 'g'), 'Token');
  }

  public async getUser(message: Message, arg: string): Promise<User> {
    if (message.mentions.users.size !== 0) return message.mentions.users.first();
    if (/[0-9]{16,18}/.test(arg)) return this.client.users.fetch(arg);
    arg = arg.toLowerCase();
    if (/[a-zA-Z]{1,30}/) return message.guild.members.cache.find((member) => member.user.username.toLowerCase().includes(arg)).user;
    return null;
  }

  public async getMember(message: Message, arg: string): Promise<GuildMember> {
    const user = await this.getUser(message, arg);
    const member = message.guild.members.fetch({ user });
    if (member) return member;
    return null;
  }

  public async getRole(message: Message, arg: string): Promise<Role> {
    if (message.mentions.roles.size !== 0) return message.mentions.roles.first();
    if (/[0-9]{16,18}/.test(arg)) return message.guild.roles.fetch(arg);
    arg = arg.toLowerCase();
    if (/[a-zA-Z]{1,30}/) return message.guild.roles.cache.find((role) => role.name.toLowerCase().includes(arg));
    return null;
  }

  public async getChannel(message: Message, arg: string, textOnly: boolean = true): Promise<GuildChannel> {
    if (message.mentions.channels.size !== 0) return message.mentions.channels.first() as TextChannel;
    if (/[0-9]{16,18}/.test(arg)) return message.guild.channels.cache.get(arg) as GuildChannel;
    arg = arg.toLowerCase();
    if (/[a-zA-Z]{1,30}/)
      return message.guild.channels.cache.find((channel) => {
        if (textOnly && channel.type !== 'text') return;
        return channel.name.toLowerCase().includes(arg);
      });
    return null;
  }

  public async getGuild(arg: string): Promise<Guild> {
    if (/[0-9]{16,18}/.test(arg)) return this.client.guilds.cache.get(arg);
    arg = arg.toLowerCase();
    if (/[a-zA-Z]{1,30}/) return this.client.guilds.cache.find((guild) => guild.name.toLowerCase().includes(arg));
    return null;
  }
}
