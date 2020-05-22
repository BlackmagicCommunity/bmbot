import fetch from 'node-fetch';
import { Client, Command, RunArgumentsOptions } from '../../util';

export default class TIASCommand extends Command {
  constructor(client: Client) {
    super(client, {
      help: 'You should just try it and see.',
    });
  }

  public async main({ msg }: RunArgumentsOptions) {
    msg.channel.send('https://tryitands.ee/');
  }
}
