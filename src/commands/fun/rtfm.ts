import { randomOf } from '@reverse/random';
import { Client, Command } from '../../util';

export default class RTFMCommand extends Command {
  constructor(client: Client) {
    super(client, {
      aliases: ['readthefuckingmanual', 'rtm'],
      help: 'If someone asks a question that is easily findable in the manual',
      deletable: true,
      arguments: [
        {
          name: 'query | link',
          type: 'string | url',
        },
      ],
    });
  }

  public async main() {
    return `You can find a collection of manuals here: https://coloraggio.github.io/davinci-resolve-manuals/ ${randomOf([
      'https://sd.keepcalms.com/i/keep-calm-and-read-the-fucking-manual-2.png',
      'https://static.giga.de/wp-content/uploads/2017/02/RTFM-Meme.jpg',
      'https://youtu.be/Z1VKn_TIXFM?t=26',
      'Read the fucking manual!\n https://images.squarespace-cdn.com/content/v1/54bcbd06e4b060f2e987ebbe/1459530149424-43S9A8RI1DN2JYXJOQ64/ke17ZwdGBToddI8pDm48kIjqXxgTUt6jL4bCHLahW0VZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpzI3ktOOqlYFVERKzP1A3uKN-hQOFf7CmjFb1WHA8IvWYefrUROdDUSV9FRYfXBRr0/image-asset.png',
    ])}`;
  }
}
