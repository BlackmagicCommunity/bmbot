import DateFormat from 'dateformat';
import { MessageAttachment } from 'discord.js';
import { Client, Command, RunArgumentsOptions } from '../../util';

export default class EvalCommand extends Command {
  constructor(client: Client) {
    super(client, {
      aliases: ['u'],
      disabled: false,
      hidden: true,
      ownerOnly: true,
      help: 'gets userinfo',
    });
  }

  public async main({ msg, guild }: RunArgumentsOptions) {
    if (!(await this.hasPermission(msg))) {
      return;
    }
    if (msg.channel.id !== '701865088180813880') {
      msg.channel.send('Only usable in <#701865088180813880>');
      return;
    }

    let str = '';

    const members = await guild.members.fetch();
    members
      .sort((a, b) => {
        return a.joinedTimestamp > b.joinedTimestamp ? -1 : a.joinedTimestamp < b.joinedTimestamp ? 1 : 0;
      })
      .forEach((member) => {
        str += `<tr><td>${member.id}</td><td>${member.user.tag}</td><td>${DateFormat(member.joinedTimestamp, 'yyyy-mm-dd h:MM TT')}</td></tr>\n`;
      });

    // write file
    const file = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>USER LIST</title>
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
        <tr><th>id</th> <th>tag</th> <th>joined</th></tr>
        ${str}
      </table>
    </body>
    </html>`;

    msg.channel.send('Here is the Member List', new MessageAttachment(new Buffer(file), 'user_list.html'));
  }
}
