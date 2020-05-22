import fetch from 'node-fetch';
import { Client, Command, RunArgumentsOptions } from '../../util';

export default class ComplimentCommand extends Command {
  constructor(client: Client) {
    super(client, {
      aliases: ['c'],
      hidden: true,
      help: 'Forces grant to say some nice things',
    });
  }

  public async main({ msg }: RunArgumentsOptions) {
    msg.channel.send((await fetch('https://timto.site/compliment.php').then((x) => x.json())).compliment);
  }
}
