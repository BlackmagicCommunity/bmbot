import {
  ApplicationCommandOptionData,
  Collection, Guild, Message, MessageAttachment, PermissionString, Snowflake, TextChannel, User,
} from 'discord.js';

export interface CommandOptions {
  name?: string;
  category?: string;
  help: string;
  aliases?: string[];
  disabled?: boolean;
  hidden?: boolean;
  optionsData?: ApplicationCommandOptionData[];
  deletable?: boolean;
  guildOnly?: boolean;
  ownerOnly?: boolean;
  developerOnly?: boolean;

  // eslint-disable-next-line no-use-before-define
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
  challMessage: string;
}

export interface ChallengeOptions {
  author?: User;
  assets?: Collection<Snowflake, MessageAttachment>;
  topic: string;
  title: string;
  description: string;
  message: Message;
}

export function autoImplement<T>(defaults?: Partial<T>) {
  return class {
    constructor() {
      Object.assign(this, defaults || {});
    }
  } as new () => T;
}
