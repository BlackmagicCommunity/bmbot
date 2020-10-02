import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { Client, Event } from '../util';

const hasPermission = (channel: TextChannel): boolean => channel.permissionsFor(channel.guild.id).has('VIEW_CHANNEL');
let cachedEmbed: MessageEmbed;

export default class MemberAddEvent extends Event {
  constructor(client: Client) {
    super(client);
  }

  public async main(member: GuildMember): Promise<any> {
    this.client.logger.join(member);
    const channel = this.client.channels.cache.get(this.client.settings.channels.welcome) as TextChannel;
    await channel
      .send(
        `${member}, welcome to the ${member.guild.name}! Please read <#${this.client.settings.channels.rules}> and assign yourself <#${this.client.settings.channels.roles}>.\nType \`${this.client.settings.prefix}help\` to learn how to use me, and \`${this.client.settings.prefix}channels\` to get a quick introduction.`
      )
      .then((m) => m.delete({ timeout: 5 * 60 * 1000, reason: 'Automatic removal of welcome message.' }));

    if (!cachedEmbed) {
      cachedEmbed = new MessageEmbed()
        .setColor(this.client.settings.colors.info)
        .setTitle('Blackmagic Community')
        .setDescription("Welcome to the Blackmagic Community Discord! Here's an overview of all channels:");

      const channels = member.guild.channels.cache.filter((e) => e.type === 'text').array() as TextChannel[];
      for (const channel of channels) {
        if (hasPermission(channel))
          cachedEmbed.addField(
            channel.name,
            `${channel.topic ? channel.topic + '\n' : ''}[Take me there!](https://discordapp.com/channels/${member.guild.id}/${channel.id}/${
              channel.lastMessageID
            })`,
            true
          );
      }
    }
    try {
      await member.send(cachedEmbed);
    } catch {
      // user has dms off
    }

    return;
  }
}
