import { Message, PermissionString } from 'discord.js';
import { resolve as Resolve } from 'path';
import { Client } from '../../core/Client';
import { CommandArguments, CommandOptions, CommandParameters, RunArgumentsOptions } from '../../typings/typings';

export class Command {
  public client: Client;
  public readonly aliases: string[];
  public readonly disabled: boolean;
  public readonly hidden: boolean;
  public readonly alias: boolean;
  public readonly guildOnly: boolean;
  public readonly ownerOnly: boolean;
  public name: string;
  public help: string;
  public category: string;
  public arguments: CommandArguments[];
  public parameters: CommandParameters[];
  public requiredPermissions: PermissionString[];

  constructor(client: Client, options: CommandOptions) {
    Object.defineProperty(this, 'client', { value: client });
    this.alias = false;
    this.aliases = options.aliases || [];
    this.disabled = options.disabled || false;
    this.hidden = options.hidden || false;
    this.ownerOnly = options.ownerOnly || false;
    this.arguments = options.arguments || [];
    this.parameters = options.parameters || [];
    this.requiredPermissions = options.requiredPermissions || [];
  }

  public hasPermission(message: Message): boolean {
    if (message.author.id === process.env.owner) return true;
    if (process.env.owner.includes(message.author.id)) return true;

    // Guild only
    if (message.channel.type === 'dm' && this.guildOnly === true) {
      return false;
    }

    // Guild Permissions
    for (const permission of this.requiredPermissions) {
      if (message.member.hasPermission(permission) === false) {
        return false;
      }
    }

    // Owner only
    if (this.ownerOnly) {
      return false;
    }

    return true;
  }

  public main(runArguments: RunArgumentsOptions): any {
    return true;
  }

  public reload(): Promise<Command | any> {
    return new Promise((resolve, reject) => {
      try {
        delete require.cache[require.resolve(Resolve('src', 'commands', this.category, this.name))];
        const commandFile: any = require(Resolve('src', 'commands', this.category, this.name)).default;
        const command: Command = new commandFile(this.client);
        this.client.commands.delete(this.name);
        this.client.commands.set(command.name, command);
      } catch (e) {
        reject(e);
      }
    });
  }
}
