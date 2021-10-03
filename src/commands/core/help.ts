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

  public async main({ msg, args }: RunArgumentsOptions) {
    if (args.length === 0) {
      const categories: Record<string, Command[]> = {};
      // Separate by category
      Array.from(this.client.commands.values())
        .forEach((cmd) => {
          if (cmd.hasPermission(msg)) {
            if (typeof categories[cmd.category] === 'undefined') categories[cmd.category] = [cmd];
            else categories[cmd.category].push(cmd);
          }
        });

      const embed = new MessageEmbed()
        .setTitle(`${this.client.user.username}'s Commands`)
        .setColor(this.client.settings.colors.info);

      Object.keys(categories).forEach((cat) => {
        const category = categories[cat];
        embed.addField(cat, `\`${category.map((c) => `${this.client.settings.prefixes[0]}${c.name}`).join('` \n`')}\``);
      });

      embed.setDescription('You can use any of the following commands by simply typing a message.');
      embed.setFooter('Staff does not take any responsibility for the bot.');
      return { embeds: [embed] };
    }

    const cmd = this.client.commands.get(args.join(' '));
    if (typeof cmd === 'undefined' || !cmd.hasPermission(msg)) throw new Error(`Command named ${args[0]} not found.`);
    return { embeds: [this.helpMessage(msg, cmd)] };
  }
}
