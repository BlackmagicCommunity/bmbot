import { MessageEmbed } from 'discord.js';
import { Client, Command, RunArgumentsOptions } from '../../util';

export default class HelpCommand extends Command {
  constructor(client: Client) {
    super(client, {
      arguments: [
        {
          all: true,
          name: 'command',
          type: 'Command',
        },
      ],
      help: 'This command!!!',
    });
  }

  public main({ msg, args }: RunArgumentsOptions) {
    if (args.length === 0) {
      const categories: any = {};
      // Separate by category
      for (const cmd of this.client.commands.map((cmd) => cmd)) {
        if (cmd.ownerOnly ? !this.client.util.isOwner(msg.author.id) && (cmd.disabled || cmd.hidden) : cmd.disabled || cmd.hidden) continue;
        if (typeof categories[cmd.category] === 'undefined') categories[cmd.category] = [cmd];
        else categories[cmd.category].push(cmd);
      }

      const embed: MessageEmbed = new MessageEmbed().setTitle(`${this.client.user.username}'s Commands`).setColor(process.env.DEFAULTCOLOR);
      for (const categoryName in categories) {
        const category: Command[] = categories[categoryName];
        let categoryCommands = '';
        for (const cmd of category) categoryCommands += ` \`${msg.prefix}${cmd.name}\`\n`;
        embed.addField(categoryName, categoryCommands, true);
      }

      embed.setDescription(`You can use any of the following commands by simply typing a message.`);
      embed.setFooter(`Staff does not take any responsibility for the bot.`)
      msg.channel.send(embed);
    } else {
      const cmd = this.client.commands.get(args[0]);
      if (typeof cmd === 'undefined') return msg.channel.send(`:x: Command named ${args[0]} not found.`);
      msg.channel.send(this.helpMessage(msg, cmd));
    }
  }
}
