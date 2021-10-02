import { Interaction, Message } from 'discord.js';
import { RunArgumentsOptions } from '../../typings/typings';

export const RunArguments = (message: Message | Interaction, args: string[]) => ({
  args,
  guild: message.guild,
  message,
  msg: message,
  user: message instanceof Message ? message.author : message.user,
} as RunArgumentsOptions);
