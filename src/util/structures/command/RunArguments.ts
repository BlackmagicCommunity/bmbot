import { Message } from 'discord.js';
import { RunArgumentsOptions } from '../../typings/typings';

export const RunArguments = (message: Message, args: string[]) => ({
  args,
  guild: message.guild,
  message,
  msg: message,
  user: message.author,
} as RunArgumentsOptions);
