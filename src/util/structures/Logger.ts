import {
  Client,
  Collection,
  GuildMember,
  Message,
  MessageEmbed,
  MessageReaction,
  MessageTarget,
  Snowflake,
  SnowflakeUtil,
  TextChannel,
  User,
} from 'discord.js';
import { LoggerChannels } from '../typings/typings';

const colors: any = {
  'Member Ban': 'RED',
  'Member Unban': 'GREEN',
  'Message Update': 'YELLOW',
  'Message Delete': 'RED',
  'Message Bulk Delete': 'RED',
};

export class Logger {
  public channels: LoggerChannels = {};

  public log(message: string): void {
    // tslint:disable-next-line:no-console
    console.log(message);
  }

  public message(message: Message | Collection<Snowflake, Message>, action: string, otherData?: any) {
    if (this.channels.messages === null) return;
    const channel = this.channels.messages as TextChannel;

    const embed = new MessageEmbed().setColor(colors[action]).setTitle(action).setTimestamp();

    if (message instanceof Collection) {
      // bulk delete
      embed.addField('Amount of messages', message.size).addField('Channel', `${message.first().channel}`);
    } else {
      if (message.content) embed.setDescription(message.cleanContent);
      if (otherData instanceof Message && otherData.content)
        embed.addField('Old Content', otherData.content.length > 1024 ? `${otherData.content.substring(0, 1021)}...` : otherData.content);
      if (colors[action] !== 'Message Delete')
        embed.addField('Link', `[Jump to Message](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`);
    }

    channel.send(embed);
  }

  public join(member: GuildMember, left: boolean = false) {
    if (this.channels.joins === null) return;
    const channel = this.channels.joins as TextChannel;

    const embed = new MessageEmbed()
      .setColor(!left ? 'GREEN' : 'RED')
      .setThumbnail(member.user.displayAvatarURL())
      .addField('User', `**${member.user.username}**#${member.user.discriminator} (${member.id})`)
      .addField('Mention', `${member}`)
      .setTimestamp();

    channel.send(embed);
  }

  public infraction(action: string, reason: string, moderator: User, target: User): void {
    if (this.channels.infractions === null) return;
    const channel = this.channels.infractions as TextChannel;

    const embed = new MessageEmbed().setTitle(action).setColor(colors[action]).setThumbnail(target.displayAvatarURL());
    if (reason) embed.addField('Reason', reason, true);
    embed
      .addField('Target', `**${target.username}**#${target.discriminator} (${target.id})`)
      .addField('Moderator', `**${moderator.username}**#${moderator.discriminator} (${moderator.id})`)
      .setTimestamp();
    channel.send(embed);
  }
}
