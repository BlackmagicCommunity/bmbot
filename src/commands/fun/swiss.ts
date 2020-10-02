import { randomOf } from '@reverse/random';
import { Client, Command, RunArgumentsOptions } from '../../util';

export default class SwissCommand extends Command {
  constructor(client: Client) {
    super(client, {
      disabled: false,
      hidden: true,
      ownerOnly: false,
      help: 'Swiss German Insult',
    });
  }

  public async main({ msg }: RunArgumentsOptions) {
    msg.channel.send(
      randomOf([
        'Huere Michi Grind',
        'Schafsäcku',
        'Degenerierts Layer-8-Phänomen',
        'Spezifikations-GAU',
        'Grachteschnäpfe',
        'Gopfverdammi',
        'Shit!',
        'Scheisse',
        'Dummi Chueh',
        'Gopferdecku',
        'Schofseckel',
        'Gwaggli',
        'Gumslä',
        'Sürel',
        'Habasch',
        'Halbschue',
        'Täschbäsä',
        'Chotzbrocke',
        'Totsch',
        'Tschumpel',
        'Säuniggel',
      ])
    );
  }
}
