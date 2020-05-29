import { Client, Command, RunArgumentsOptions } from '../../util';

const responses: string[] = [
  'https://media.giphy.com/media/v1dTuaCHDuEA8/giphy.gif',
  'Pong!',
  "No! I'm better than just writting 'Pong'",
  "Pong... ee. Hah you didn't expect this one. No seriously get yourself a warm blanket, it's cold outside!",
  'Stop pinging me! I want to sleep',
  "Dude stop pinging me! I'm presenting the new Blackmagic Not Anymore Pocket Cinema Camera 8k",
  'You expected me to say Pong! And so I did...',
  'Pingreeeeee',
  'Ping? Ping! I will tell you who I ping next!',
  "Ping, Pong, Ping, Pong, Ping, Pong, Ping, Pong... That's the last Ping Pong Championship summarized",
  'Ping!',
];

export default class PingCommand extends Command {
  constructor(client: Client) {
    super(client, {
      help: "Test if the bot is available.",
    });
  }

  public main({ msg }: RunArgumentsOptions) {
    msg.channel.send(`${responses[Math.floor(Math.random() * responses.length)]}. Took me ${msg.createdTimestamp - Date.now()}ms`);
  }
}
