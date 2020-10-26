import { compactTime } from '@reverse/compact';
import { MessageEmbed } from 'discord.js';
import fs from 'fs';
import os from 'os-utils';
import path from 'path';
import { Client, Command, RunArgumentsOptions } from '../../util';

const { version, contributors, description, homepage } = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../package.json')).toString());

function cpu(): any {
  return new Promise((resolve) => os.cpuUsage(resolve));
}

function msToTime(ms: number): string {
  const seconds = Math.floor((ms / 1000) % 60),
    minutes = Math.floor((ms / (1000 * 60)) % 60),
    hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

  const hres = hours > 0 ? `${hours} hours` : '',
    mres = minutes > 0 ? `${minutes} minutes` : '',
    sres = seconds > 0 ? `${seconds} seconds` : '';

  return `${hres !== '' ? `${hres}, ` : ''}${mres !== '' ? `${mres}, ` : ''}${sres}`;
}

export default class StatsCommand extends Command {
  constructor(client: Client) {
    super(client, {
      help: "Shows bot's status.",
      aliases: ['status'],
    });
  }

  public async main({ msg, guild }: RunArgumentsOptions) {
    const cpuPercent = (100 * (await cpu())).toFixed(0);
    const usedMem = ((os.totalmem() - os.freemem()) / 1000).toFixed(1);
    const totalMem = (os.totalmem() / 1000).toFixed(1);
    const botMem = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);

    const systemUptime = compactTime(os.sysUptime()).replace(/[0-9]+ Minutes.*$/, '');

    const systemUsage = [
      `System CPU: ${cpuPercent}%`,
      `System Memory: ${usedMem}/${totalMem}GB`,
      `System Uptime: ${systemUptime}`,
      `Bot Memory: ${botMem} MB`,
      `Bot Uptime: ${msToTime(this.client.uptime)}`,
    ].join('\n');

    const topCommands = this.client.commands
      .filter((c) => c.usageCount !== 0)
      .sort((a, b) => {
        if (a.usageCount > b.usageCount) return -1;
        else if (a.usageCount < b.usageCount) return 1;
        else return 0;
      })
      .map((e) => `${e.name} -> ${e.usageCount} usages.`)
      .slice(0, 5)
      .join('\n');

    const embed: MessageEmbed = new MessageEmbed()
      .setDescription(description)
      .setTitle(`${this.client.user.username}'s statistics`)
      .setColor(this.client.settings.colors.info)
      .addField('System Usage', systemUsage, true)
      .addField('Source', `[Github Repository](${homepage})`, true)
      .addField('Version', version, true)
      .addField('Member Count', guild.memberCount, true)
      .addField('Authors', contributors.map((contrib: any) => (contrib.url ? `[${contrib.name}](${contrib.url})` : contrib.name)).join('\n'), true)
      .addField('Top Commands', topCommands, true)
      .setFooter(`${this.client.commands.reduce((acc, c) => acc + c.usageCount, 0)} total commands ran`);

    msg.channel.send(embed);
  }
}
