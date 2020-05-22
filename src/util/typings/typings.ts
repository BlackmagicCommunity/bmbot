import {
  APIMessage,
  Guild,
  Message as message,
  MessageAdditions,
  MessageOptions,
  PermissionString,
  StringResolvable,
  TextChannel,
  User,
} from 'discord.js';
import { Client } from '../core/Client';
import { Command } from '../structures/command/Command';

export interface EventOptions {
  disabled?: boolean;
}

export interface Message extends message {
  prefix: string;
  command: Command;
  client: Client;
}

export interface CommandOptions {
  aliases?: string[];
  help: string;
  deletable?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  ownerOnly?: boolean;
  developerOnly?: boolean;
  arguments?: CommandArguments[];
  parameters?: CommandParameters[];
  requiredPermissions?: PermissionString[];
  allowedChannels?: string[];
  allowedRoles?: string[];
  cooldown?: number;
}

export interface CommandArguments {
  name: string;
  type: string;
  required?: boolean;
  infinite?: boolean;
  all?: boolean;
}

export interface CommandParameters {
  name: string;
  type?: string;
}

export interface RunArgumentsOptions {
  message: Message;
  msg: Message;
  args: string[];
  user: User;
  guild: Guild;
}

export interface LoggerChannels {
  messages?: TextChannel;
  joins?: TextChannel;
  infractions?: TextChannel;
}
