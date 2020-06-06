import { MessageEmbed, TextChannel } from 'discord.js';
import { Client, Command, RunArgumentsOptions } from '../../util';

const hasPermission = (channel: TextChannel): boolean => channel.permissionsFor(channel.guild.id).has('VIEW_CHANNEL');

export default class ChannelsCommand extends Command {
  constructor(client: Client) {
    super(client, {
      arguments: [
        {
          all: true,
          name: 'channel',
          type: 'Channel',
        },
      ],
      aliases: ['channel'],
      help: 'Returns the channel(s) info',
      guildOnly: true,
    });
  }

  public async main({ msg, guild, args }: RunArgumentsOptions) {
    const embed: MessageEmbed = new MessageEmbed().setColor(process.env.DEFAULTCOLOR);

    if (args.length === 0) {
      embed.setTitle(`${guild.name} - Channels`);
      const channels: TextChannel[] = guild.channels.cache.filter((e) => e.type === 'text').array() as TextChannel[];
      for (const channel of channels) {
        if (hasPermission(channel))
          embed.addField(
            channel.name,
            `${channel.topic ? channel.topic + '\n' : ''}[Take me there!](https://discordapp.com/channels/${guild.id}/${channel.id}/${
              channel.lastMessageID
            })`,
            true
          );
      }
    } else {
      const channel = (await this.client.util.getChannel(msg, args.join(' '), true)) as TextChannel;
      if (!channel || !hasPermission(channel)) return msg.channel.send(':x: Channel not found.');
      if (!channel.topic) return msg.channel.send("Sorry, can't help you with that one.");
      embed.setTitle(channel.name).setDescription(channel.topic);
    }

    msg.channel.send(embed);
  }
}
