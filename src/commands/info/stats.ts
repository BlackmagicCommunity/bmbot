import { MessageEmbed } from 'discord.js';
import { Client, Command, RunArgumentsOptions } from '../../util';
import os from 'os-utils'

//import { version, author, description } from '../../../package.json';
const { version, author, description, homepage } = require('../../../package.json');

function cpu(): any {
    return new Promise(resolve => os.cpuUsage(resolve));
}

export default class PingCommand extends Command {
  constructor(client: Client) {
    super(client, {
      help: "Shows bot's status.",
      aliases: ['status']
    });
  }

  public async main({ msg }: RunArgumentsOptions) {
    const embed: MessageEmbed = new MessageEmbed()
    .setTitle(`${this.client.user.username}'s statistics`)
    .setColor(process.env.DEFAULTCOLOR)
    .addField('System Usage', `CPU: ${(100 * (await cpu())).toFixed(0)}%\nMemory: ${((os.totalmem() - os.freemem()) / 1000).toFixed(2)}/${(os.totalmem() / 1000).toFixed(2)}GB`, true)
    .addField('Source', `[Github Repository](${homepage})`, true)
    .addField('Version', version, true)
    .addField('User Count', this.client.users.cache.size, true)
    .addField('Authors', author, true)
    .setDescription(description);

    msg.send(embed);
  }
}
