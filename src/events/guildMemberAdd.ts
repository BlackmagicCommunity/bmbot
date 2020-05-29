import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { Client, Event } from '../util';

const hasPermission = (channel: TextChannel): boolean => channel.permissionsFor(channel.guild.id).has('VIEW_CHANNEL');

export default class MemberAddEvent extends Event {
  constructor(client: Client) {
    super(client, {
      disabled: false,
    });
  }

  async main(member: GuildMember): Promise<any> {
    try {
      this.client.logger.join(member);
      const channel = this.client.channels.cache.get(process.env.WELCOME_CHANNEL) as TextChannel;
      await channel
        .send(
          `${member}, welcome to the ${member.guild.name}! Please read <#${process.env.RULES_CHANNEL}> and assign yourself <#${process.env.ROLES_CHANNEL}>.\nType \`${this.client.prefix} help\` to learn how to use me, and \`${this.client.prefix} channels\` to get a quick introduction.`
        )
        .then((m) => m.delete({ timeout: 5 * 60 * 1000, reason: 'Automatic removal of welcome message.' }));

      const embed: MessageEmbed = new MessageEmbed()
        .setColor(process.env.DEFAULTCOLOR)
        .setTitle('Blackmagic Community')
        .setDescription("Welcome to the Blackmagic Community Discord! Here's an overview of all channels:");

      const channels = member.guild.channels.cache.filter((e) => e.type === 'text').array() as TextChannel[];
      for (const channel of channels) {
        if (hasPermission(channel))
          embed.addField(
            channel.name,
            `${channel.topic ? channel.topic + '\n' : ''}[Take me there!](https://discordapp.com/channels/${member.guild.id}/${channel.id}/${
              channel.lastMessageID
            })`,
            true
          );
      }

      await member.send(embed);
    } catch {
      // user has dms off
    }

    return;
  }
}
