import { Client, Command, RunArgumentsOptions } from '../../util'
import { PermissionString, MessageEmbed } from 'discord.js';

export default class PingCommand extends Command {
  constructor(client: Client) {
    super(client, { });
  }

  public main({ msg }: RunArgumentsOptions) {
    msg.send(`Pong! ${msg.createdTimestamp - Date.now()}ms`);

    const embed = new MessageEmbed()
  .addField('[test](https://canary.discordapp.com/channels/701865087262261278/701865087442616380/701908941059391520)', '[test](https://canary.discordapp.com/channels/701865087262261278/701865087442616380/701908941059391520)')
    msg.send(embed)
  }
}