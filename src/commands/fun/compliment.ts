import fetch from 'node-fetch';
import { Client, Command, RunArgumentsOptions } from '../../util';

export default class ComplimentCommand extends Command {
  constructor(client: Client) {
    super(client, {
      aliases: ['c', '​'],
      help: 'say nice',
    });
  }

  public async main({ msg }: RunArgumentsOptions) {
    msg.channel.send((await fetch('https://timto.site/compliment.php').then((x) => x.json())).compliment);
    if (msg.deletable) {
      msg.delete();
    }
  }
}
