import { GuildMember, GuildMemberRoleManager, Message, PermissionString, Role, TextChannel } from 'discord.js';
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
  public readonly deletable: boolean;
  public name: string;
  public help: string;
  public category: string;
  public arguments: CommandArguments[];
  public parameters: CommandParameters[];
  public requiredPermissions: PermissionString[];
  public allowedChannels: string[];
  public allowedRoles: string[];

  constructor(client: Client, options: CommandOptions) {
    Object.defineProperty(this, 'client', { value: client });
    this.alias = false;
    this.aliases = options.aliases || [];
    this.deletable = options.deletable || false;
    this.disabled = options.disabled || false;
    this.hidden = options.hidden || false;
    this.help = options.help || 'Command goes brrrr';
    this.ownerOnly = options.ownerOnly || false;
    this.arguments = options.arguments || [];
    this.parameters = options.parameters || [];
    this.requiredPermissions = options.requiredPermissions || [];
    this.allowedChannels = options.allowedChannels || [];
    this.allowedRoles = options.allowedRoles || [];
  }

  public hasPermission(message: Message): boolean {
    if (this.client.util.isOwner(message.author.id)) return true;

    // Guild only
    if (message.channel.type === 'dm' && this.guildOnly === true) return false;

    // Guild Permissions
    for (const permission of this.requiredPermissions) {
      if (message.member.hasPermission(permission) === false) {
        return false;
      }
    }

    // Allowed Channels
    let allowed = false;
    if (this.allowedChannels.length !== 0) {
      for (const chnl of this.allowedChannels) {
        const c: TextChannel = message.guild.channels.cache.find(
          (a) => a.type === 'text' && (a.name.toLowerCase().includes(chnl.toLowerCase()) || a.id === chnl)
        ) as TextChannel;
        if (c && message.channel.id) {
          allowed = true;
          break;
        }
      }
      if (!allowed) return false;
    }

    // Allowed Roles
    if (this.allowedRoles.length !== 0) {
      allowed = false;
      const memberRoles: GuildMemberRoleManager = message.member.roles;
      for (const rol of this.allowedRoles) {
        const r: Role = message.guild.roles.cache.find((a) => a.name.toLowerCase().includes(rol.toLowerCase()) || a.id === rol);
        if (r && memberRoles.cache.has(r.id)) {
          allowed = true;
          break;
        }
      }
      if (!allowed) return false;
    }

    // Owner only
    if (this.ownerOnly) return false;

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
