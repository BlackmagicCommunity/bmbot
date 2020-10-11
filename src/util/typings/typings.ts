import { Guild, Message, PermissionString, TextChannel, User } from 'discord.js';

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

export interface UserData {
  id?: string;
  msgCount: number;
  totalXp: number;
  currentXp: number;
  level: number;
}

export interface IRoleData {
  id: string;
  single: boolean | number;
  level: number;
}

export interface GuildData {
  id?: string;
  challTopic: string;
  challTitle: string;
  challDesc: string;
  challStart: string;
}