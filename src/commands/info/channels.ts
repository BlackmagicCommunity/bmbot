import {
  Collection, MessageEmbed, Snowflake, TextChannel,
} from 'discord.js';
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
    const embed = new MessageEmbed().setColor(this.client.settings.colors.info);

    if (args.length === 0) {
      embed.setTitle(`${guild.name} - Channels`);
      const channels = guild.channels.cache.filter((e) => e.type === 'GUILD_TEXT') as Collection<Snowflake, TextChannel>;
      channels.forEach((c) => {
        if (hasPermission(c)) {
          embed.addField(c.name,
            `${c.topic ? `${c.topic}\n` : ''}[Take me there!](https://discordapp.com/channels/${guild.id}/${c}/${
              c.lastMessageId
            })`,
            true);
        }
      });
    } else {
      const channel = (await this.client.util.getChannel(msg, args.join(' '), true)) as TextChannel;
      if (!channel || !hasPermission(channel)) throw new Error('Channel not found.');
      if (!channel.topic) throw new Error("Sorry, can't help you with that one.");
      embed.setTitle(channel.name).setDescription(channel.topic);
    }

    return { embeds: [embed] };
  }
}
