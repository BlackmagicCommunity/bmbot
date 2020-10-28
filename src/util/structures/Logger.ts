import DateFormat from 'dateformat';
import { Collection, GuildMember, Invite, Message, MessageAttachment, MessageEmbed, Snowflake, TextChannel, User } from 'discord.js';
import { Client } from '../../util';
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
  public client: Client;

  constructor(client: Client) {
    Object.defineProperty(this, 'client', { value: client });
  }

  public message(message: Message | Collection<Snowflake, Message>, action: string, otherData?: any) {
    if (this.channels.messages === null) return;
    const channel = this.channels.messages as TextChannel;

    const embed = new MessageEmbed().setColor(colors[action]).setTitle(action).setTimestamp();

    if (message instanceof Collection) {
      // bulk delete
      let str = '';
      message
        .sort((a, b) => {
          return a.createdTimestamp > b.createdTimestamp ? -1 : a.createdTimestamp < b.createdTimestamp ? 1 : 0;
        })
        .forEach((m: Message) => {
          str += `<tr><td>${m.author.id}</td><td>${m.author.tag}</td><td>${m.content}</td><td>${DateFormat(
            m.createdTimestamp,
            'yyyy-mm-dd h:MM TT'
          )}</td></tr>\n`;
        });
      const file = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bulk Delete at ${new Date()}</title>
        <style>
        table, td, th {
          border: 1px solid black;
        }
        td {
          padding:5px;
        }
        table {
          border-collapse: collapse;
        }
        tr:nth-child(even) {
          background:#eee;
        }</style>
      </head>
      <body>
        <table>
          <tr><th>id</th> <th>tag</th> <th>content</th> <th>date</th></tr>
          ${str}
        </table>
      </body>
      </html>`;
      embed
        .addField('Amount of messages', message.size)
        .addField('Channel', `${message.first().channel}`)
        .attachFiles([new MessageAttachment(Buffer.from(file), 'message_list.html')]);
    } else {
      if (!message.guild) return; // don't want it from dms
      if (message.content) embed.setDescription(message.cleanContent);
      if (otherData instanceof Message && otherData.content)
        embed.addField('Old Content', otherData.content.length > 1024 ? `${otherData.content.substring(0, 1021)}...` : otherData.content);
      if (colors[action] !== 'Message Delete')
        embed.addField('Link', `[Jump to Message](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})`);
    }

    channel.send(embed);
  }

  public async join(member: GuildMember, left: boolean = false) {
    if (this.channels.joins === null) return;
    const channel = this.channels.joins as TextChannel;

    let used: Invite;
    if (!left) {
      const cached = this.client.invites.get(member.guild.id);
      const current = await member.guild.fetchInvites();
      used = cached.find((invite) => {
        return current.get(invite.code).uses !== invite.uses;
      });
    }

    const embed = new MessageEmbed()
      .setColor(!left ? 'GREEN' : 'RED')
      .setThumbnail(member.user.displayAvatarURL())
      .addField('User', `**${member.user.username}**#${member.user.discriminator} (${member.id})`)
      .addField('Mention', `${member}`)
      .setTimestamp();
    if (used) embed.addField('Invited by', `**${used.inviter.username}**#${used.inviter.discriminator} (${used.inviter.id}) - ${used.uses} uses`);

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
