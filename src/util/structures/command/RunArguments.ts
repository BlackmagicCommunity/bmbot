import { Message, RunArgumentsOptions } from '../../typings/typings';

export const RunArguments = (message: Message, args: string[]) => {
  return {
    args,
    guild: message.guild,
    message,
    msg: message,
    user: message.author,
  } as RunArgumentsOptions;
};
