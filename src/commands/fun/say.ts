import { TextChannel } from 'discord.js';
import { Client, Command, RunArgumentsOptions } from '../../util';

export default class SayCommand extends Command {
  constructor(client: Client) {
    super(client, {
      help: 'Replicates your message.',
      deletable: true,
      ownerOnly: true,
      arguments: [
        {
          name: 'channel',
          required: true,
          type: 'Channel',
        },
        {
          name: 'message',
          required: true,
          type: 'string',
        },
      ],
    });
  }

  public async main({ msg, args }: RunArgumentsOptions) {
    let channel = (await this.client.util.getChannel(msg, args[0], true)) as TextChannel;
    if (!channel) channel = msg.channel as TextChannel;
    else {
      try {
        await channel.send(args.join(' '));
      } catch {
        msg.channel.send(`:x: Can't send messages there.`);
      }
    }
  }
}
