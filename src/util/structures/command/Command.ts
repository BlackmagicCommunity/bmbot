import { Collection, MessageEmbed, PermissionString, Snowflake, TextChannel } from 'discord.js';
import { resolve as Resolve } from 'path';
import { Client } from '../../core/Client';
import { CommandArguments, CommandOptions, CommandParameters, Message, RunArgumentsOptions } from '../../typings/typings';

export class Command {
  public name: string;
  public category: string;
  public client: Client;
  public usageCount: number;
  public readonly aliases: string[];
  public readonly disabled: boolean;
  public readonly hidden: boolean;
  public readonly alias: boolean;
  public readonly guildOnly: boolean;
  public readonly ownerOnly: boolean;
  public readonly developerOnly: boolean;
  public readonly deletable: boolean;
  public readonly help: string;
  public readonly arguments: CommandArguments[];
  public readonly parameters: CommandParameters[];
  public readonly requiredPermissions: PermissionString[];
  public readonly allowedChannels: string[];
  public readonly allowedRoles: string[];
  public readonly cooldown: number;
  public readonly cooldowns: Collection<Snowflake, number> | null;

  constructor(client: Client, options: CommandOptions) {
    Object.defineProperty(this, 'client', { value: client });
    this.alias = false;
    this.aliases = options.aliases || [];
    this.deletable = options.deletable || false;
    this.disabled = options.disabled || false;
    this.hidden = options.hidden || false;
    this.help = options.help || 'Command goes brrrr';
    this.ownerOnly = options.ownerOnly || false;
    this.developerOnly = options.developerOnly || false;
    this.arguments = options.arguments || [];
    this.parameters = options.parameters || [];
    this.requiredPermissions = options.requiredPermissions || [];
    this.allowedChannels = options.allowedChannels || [];
    this.allowedRoles = options.allowedRoles || [];

    this.cooldown = options.cooldown || 0;
    this.cooldowns = this.cooldown !== 0 ? new Collection<Snowflake, number>() : null;

    this.usageCount = 0;
  }

  public hasPermission(message: Message): boolean {
    // Guild only
    if (message.channel.type === 'dm' && this.guildOnly === true) return false;

    if (this.client.util.isOwner(message.author.id)) return true;
    if (this.ownerOnly) return false;

    if (this.client.util.isDeveloper(message.author.id)) return true;
    if (this.developerOnly) return false;

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
        const c = message.guild.channels.cache.find(
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
      const memberRoles = message.member.roles;
      for (const rol of this.allowedRoles) {
        const r = message.guild.roles.cache.find((a) => a.name.toLowerCase().includes(rol.toLowerCase()) || a.id === rol);
        if (r && memberRoles.cache.has(r.id)) {
          allowed = true;
          break;
        }
      }
      if (!allowed) return false;
    }

    return true;
  }

  public helpMessage(message: Message, command: Command = this): MessageEmbed {
    const embed = new MessageEmbed().setTitle(`${message.client.user.username}'s Commands`).setColor(process.env.DEFAULTCOLOR);

    embed.setDescription(command.help).addField('Command', `${command.name} (${command.category})`, true);

    if (command.guildOnly) embed.addField('Guild Only', 'Yes', true);
    if (command.aliases.length !== 0) embed.addField('Aliases', `\`${command.aliases.join('`, `')}\``, true);
    if (command.arguments.length !== 0)
      embed.addField(
        'Usage',
        `${message.prefix}${command.name} ${command.arguments.map((a) => `${a.required ? '<' : '['}${a.name}${a.required ? '>' : ']'}`).join(' ')}`
      );
    if (command.requiredPermissions.length !== 0) embed.addField('Required Permissions', `\`${command.requiredPermissions.join('`, `')}\``, false);
    if (command.ownerOnly || command.developerOnly) embed.addField('Developer Only', 'Yes');
    return embed;
  }

  public handleCommand(runArguments: RunArgumentsOptions): any {
    if (runArguments.message.command.disabled) return;
    if (!runArguments.message.command.hasPermission(runArguments.message)) return runArguments.message.react('❌');

    if (this.cooldown !== 0) {
      const cooldown = this.cooldowns.get(runArguments.user.id);
      if (cooldown)
        return runArguments.message.channel.send(
          `:clock1: Way too fast! Wait \`${((cooldown - Date.now()) / 1000).toFixed(2)}\` seconds to continue.`
        );
      else {
        this.cooldowns.set(runArguments.user.id, Date.now() + this.cooldown * 1000);
        this.client.setTimeout(() => this.cooldowns.delete(runArguments.user.id), this.cooldown * 1000);
      }
    }

    if (runArguments.args.length === 0 && this.arguments.reduce((acc, a) => (a.required ? acc + 1 : acc), 0) !== 0)
      return runArguments.message.channel.send(this.helpMessage(runArguments.message));

    this.usageCount++;
    this.main(runArguments);
    if (this.deletable && runArguments.message.deletable) runArguments.message.delete();
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
