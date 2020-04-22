import { Message, RunArgumentsOptions } from '../../typings/typings';

export const RunArguments = (message: Message, args: string[]) => {
  return {
    args,
    guild: message.guild,
    message: message as Message,
    msg: message as Message,
    user: message.author,
  } as RunArgumentsOptions;
};
