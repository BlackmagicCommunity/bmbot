import {
  APIMessage,
  Guild,
  Message as message,
  MessageAdditions,
  MessageOptions,
  PermissionString,
  Role as role,
  Snowflake,
  StringResolvable,
  TextChannel,
  User as user,
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

export interface Role extends role {
  level: number;
  single: boolean | number;
  client: Client;
}

export interface User extends user {
  messageCount: number;
  level: number;
  xp: number;
  remainingXp: number;
  client: Client;
}

export interface CommandOptions {
  aliases?: string[];
  help: string;
  deletable?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  ownerOnly?: boolean;
  guildOnly?: boolean;
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

export interface ConfigChannels {
  joins?: TextChannel;
  leaves?: TextChannel;
  infractions?: TextChannel;
  rules?: TextChannel;
}

export interface LevelRow {
  user_id: Snowflake;
  xp: number;
  message_count: number;
}
