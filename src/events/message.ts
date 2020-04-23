import { MessageEmbed, TextChannel } from 'discord.js';
import { Client, Event, Message, RunArguments } from '../util';

export default class MessageEvent extends Event {
  constructor(client: Client) {
    super(client, {
      disabled: false,
    });
  }

  public async main(message: Message): Promise<any> {
    if (message.author.bot) return;
    if (message.guild && !(message.channel as TextChannel).permissionsFor(message.guild.me).has('SEND_MESSAGES')) {
      return;
    }
    const commandPrefix = this.client.prefix;
    const prefix = new RegExp(`<@!?${this.client.user.id}> |^${this.regExpEsc(commandPrefix)}`).exec(message.content);
    if (!prefix) return;
    message.prefix = commandPrefix;
    const args = message.content.slice(prefix[0].length).trim().split(/ +/g);
    const command = this.client.commands.get(args.shift().toLowerCase());
    if (!command) return;
    message.command = command;
    if (command.disabled) return;
    if (typeof command.hasPermission === 'function' && !command.hasPermission(message)) return message.react('❌');
    const commandArguments = RunArguments(message, args);
    try {
      await command.main(commandArguments);
      if (command.deletable) message.delete();
    } catch (e) {
      this.client.logger.log(e);
    }
  }

  private regExpEsc(str: string) {
    return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  }
}
