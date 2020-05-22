import { User } from 'discord.js';
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

  public clean(text: string) {
    return text
      .replace(/`/g, `\`${String.fromCharCode(8203)}`)
      .replace(/@/g, `@${String.fromCharCode(8203)}`)
      .replace(new RegExp(`${this.client.token}`, 'g'), 'Token');
  }

  public async getUser(message: Message, arg: string): Promise<User> {
    if (message.mentions.users.size > 0) {
      return message.mentions.users.first() as User;
    }
    if (arg && /[0-9]{16,18}/.test(arg)) {
      return this.client.users.fetch(arg) as User | Promise<User>;
    }
    if (arg && /[a-zA-Z]{1,30}/) {
      return message.guild.members.cache.find((member) => member.user.username.toLowerCase().includes(arg)).user as User;
    }
    return message.author as User;
  }
}
