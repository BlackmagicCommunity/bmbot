import { MessageEmbed, TextChannel } from 'discord.js';
import { Client, Command, RunArgumentsOptions } from '../../util';

export default class ChannelsCommand extends Command {
  constructor(client: Client) {
    super(client, {
      arguments: [
        {
          all: true,
          name: 'channel',
          type: 'channel',
        },
      ],
      aliases: ['channel'],
      help: 'Returns the channel(s) info',
    });
  }

  public async main({ msg, args }: RunArgumentsOptions) {
    const embed: MessageEmbed = new MessageEmbed().setColor(process.env.DEFAULTCOLOR);

    if (args.length === 0) {
      embed.setTitle('Blackmagic Community - Channels');
      const channels: TextChannel[] = msg.guild.channels.cache.filter((e) => e.type === 'text').array() as TextChannel[];
      for (const channel of channels) {
        if (channel.members.has(msg.author.id))
          embed.addField(
            channel.name,
            `${channel.topic ? channel.topic + '\n' : ''}[Take me there!](https://discordapp.com/channels/${msg.guild.id}/${channel.id}/${
              channel.lastMessageID
            })`,
            true
          );
      }
    } else {
      const channel: TextChannel = msg.guild.channels.cache.find(
        (c) => c.name.includes(args[0]) || c.toString() === args[0] || c.id === args[0]
      ) as TextChannel;
      if (!channel) return msg.channel.send(':x: Channel not found.');
      if (!channel.topic) return msg.channel.send("Sorry, can't help you with that one.");

      embed.setTitle(`Blackmagic Community - ${channel.name}`).setDescription(channel.topic);
    }

    msg.channel.send(embed);
  }
}
