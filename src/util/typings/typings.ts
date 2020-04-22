import {
  APIMessage,
  Guild,
  Message as message,
  MessageAdditions,
  MessageOptions,
  PermissionString,
  StringResolvable,
  User,
  WSEventType,
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
  send(options?: MessageOptions | MessageAdditions | APIMessage): any;
  send(content?: StringResolvable, options?: MessageOptions | MessageAdditions): any;
}

export interface CommandOptions {
  aliases?: string[];
  disabled?: boolean;
  hidden?: boolean;
  ownerOnly?: boolean;
  arguments?: CommandArguments[];
  parameters?: CommandParameters[];
  requiredPermissions?: PermissionString[];
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
