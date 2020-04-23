import { randomOf } from '@reverse/random';
import { Client, Command, RunArgumentsOptions } from '../../util';
import compliment_data from './compliment_data';

export default class ComplimentCommand extends Command {
  constructor(client: Client) {
    super(client, {
      disabled: false,
      hidden: true,
      ownerOnly: false,
      help: 'say nice',
    });
  }

  public async main({ msg }: RunArgumentsOptions) {
    msg.channel.send(randomOf(compliment_data));
    if (msg.deletable) {
      msg.delete();
    }
  }
}
