import {
  Collection, Message, MessageEmbed, MessagePayload,
  PermissionString, ReplyMessageOptions, Snowflake,
} from 'discord.js';
import { Client } from '../../core/Client';
import { CommandArguments, CommandOptions, RunArgumentsOptions } from '../../typings/typings';

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
    this.guildOnly = options.guildOnly || false;
    this.ownerOnly = options.ownerOnly || false;
    this.developerOnly = options.developerOnly || false;
    this.arguments = options.arguments || [];
    this.requiredPermissions = options.requiredPermissions || [];
    this.allowedChannels = options.allowedChannels || [];
    this.allowedRoles = options.allowedRoles || [];

    this.cooldown = options.cooldown || 0;
    this.cooldowns = this.cooldown !== 0 ? new Collection<Snowflake, number>() : null;

    this.usageCount = 0;
  }

  public hasPermission(message: Message): boolean {
    // Guild only
    if (message.channel.type === 'DM' && this.guildOnly) return false;

    if (this.client.util.isOwner(message.author.id)) return true;
    if (this.ownerOnly) return false;

    if (this.developerOnly && !this.client.util.isDeveloper(message.author.id)) return false;

    // Guild Permissions
    if (this.requiredPermissions.some(
      (perm) => (!message.member.permissions.has(perm) || !message.guild.me.permissions.has(perm)),
    )) {
      return false;
    }

    // Allowed Channels
    if (!this.allowedChannels.some(
      (channel) => message.guild.channels.cache.find((c) => c.id === channel || (c.type === 'GUILD_TEXT' && c.name.toLowerCase().includes(channel.toLowerCase()))),
    )) { return false; }

    // Allowed Roles
    if (!this.allowedRoles.some(
      (role) => message.guild.roles.cache.find(
        (r) => r.id === role || r.name.toLowerCase().includes(role.toLowerCase()),
      ),
    )) { return false; }

    return true;
  }

  public helpMessage(message: Message, command: Command = this): MessageEmbed {
    const embed = new MessageEmbed().setTitle(`${message.client.user.username}'s Commands`).setColor(this.client.settings.colors.info);

    embed.setDescription(command.help).addField('Command', `${command.name} (${command.category})`, true);

    if (command.guildOnly) embed.addField('Guild Only', 'Yes', true);
    if (command.aliases.length !== 0) embed.addField('Aliases', `\`${command.aliases.join('`, `')}\``, true);
    if (command.arguments.length !== 0) {
      embed.addField(
        'Usage',
        `${message.prefix}${command.name} ${command.arguments.map((a) => `${a.required ? '<' : '['}${a.name}${a.required ? '>' : ']'}`).join(' ')}`,
      );
    }
    if (command.ownerOnly || command.developerOnly) embed.addField('Developer Only', 'Yes');
    if (command.requiredPermissions.length !== 0) embed.addField('Required Permissions', `\`${command.requiredPermissions.join('`, `')}\``);
    if (command.allowedRoles.length !== 0) embed.addField('Allowed Roles', `\`${command.allowedRoles.join('`, `')}\``);
    if (command.allowedChannels.length !== 0) embed.addField('Allowed Channels', `\`${command.allowedChannels.join('`, `')}\``);
    return embed;
  }

  public async handleCommand(runArguments: RunArgumentsOptions):
  Promise<string | MessagePayload | ReplyMessageOptions> {
    if (runArguments.message.command.disabled) return;
    if (!runArguments.message.command.hasPermission(runArguments.message)) {
      runArguments.message.react('❌');
      return;
    }

    if (this.cooldown !== 0) {
      const cooldown = this.cooldowns.get(runArguments.user.id);
      if (cooldown) {
        throw new Error(`:clock1: Way too fast! Wait \`${((cooldown - Date.now()) / 1000).toFixed(2)}\` seconds to continue.`);
      }

      this.cooldowns.set(runArguments.user.id, Date.now() + this.cooldown * 1000);
      setTimeout(() => this.cooldowns.delete(runArguments.user.id), this.cooldown * 1000);
    }

    if (runArguments.args.length < this.arguments.length && this.arguments.reduce(
      (acc, a) => (a.required ? acc + 1 : acc), 0,
    ) !== 0) {
      return { embeds: [this.helpMessage(runArguments.message)] } as ReplyMessageOptions;
    }

    this.usageCount++;
    if (this.deletable && runArguments.message.deletable) runArguments.message.delete();
    return this.main(runArguments);
  }

  // eslint-disable-next-line no-unused-vars
  public async main(runArguments: RunArgumentsOptions):
   Promise<string | MessagePayload | ReplyMessageOptions> {
    return null;
  }
}
