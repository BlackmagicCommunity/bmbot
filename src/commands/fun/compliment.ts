import fetch from 'node-fetch';
import { Client, Command } from '../../util';

export default class ComplimentCommand extends Command {
  constructor(client: Client) {
    super(client, {
      aliases: ['c'],
      help: 'Forces grant to say some nice things.',
      deletable: true,
      optionsData: [],
    });
  }

  public async main() {
    return (await fetch('https://timto.site/compliment.php').then((x) => x.json())).compliment;
  }
}
