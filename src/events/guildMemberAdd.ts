import { Collection, GuildMember, MessageEmbed, Snowflake, TextChannel } from 'discord.js';
import { Client, Event } from '../util';

const hasPermission = (channel: TextChannel): boolean => channel.permissionsFor(channel.guild.id).has('VIEW_CHANNEL');

export default class MemberAddEvent extends Event {
  constructor(client: Client) {
    super(client, {
      disabled: false,
    });
  }

  private cachedEmbed: MessageEmbed = null;
  private latestMembers = new Collection<Snowflake, number>(); // uid, time
  private readonly latestMembersThreshold = 10000;
  private readonly raidOkLevelWait = 1200000;
  private readonly raidThreshold = 10;
  private readonly raidVerificationLevel = 'HIGH';
  private readonly raidOkLevel = 'LOW';
  private readonly raidKickMessage = 'You have been automatically kicked from Blackmagic Community since the server is in lockdown. Try again later.';
  private isBeingRaided = false;

  private async kickMember(member: GuildMember) {
    try {
      await member.send(this.raidKickMessage);
    } catch {
    } finally {
      // dms closed or something
      if (member) await member.kick(`AntiRaid - ${this.raidThreshold} joins in ${this.latestMembersThreshold / 1000} seconds.`);
    }
  }

  private async handleRaid(member: GuildMember) {
    const now = Date.now();
    // remove all old members who joined more than x seconds ago
    this.latestMembers.set(member.id, now);
    // count how many joins in latest x seconds
    const members = this.latestMembers.filter((v) => now - v <= this.latestMembersThreshold);
    const { guild } = member;
    if (members.size >= this.raidThreshold) {
      if (!this.isBeingRaided) {
        // set lockdown
        if (guild.me.hasPermission('MANAGE_GUILD')) {
          await guild.setVerificationLevel(
            this.raidVerificationLevel,
            `AntiRaid - ${this.raidThreshold} joins in ${this.latestMembersThreshold / 1000} seconds.`
          );
          this.client.setTimeout(() => {
            guild.setVerificationLevel(this.raidOkLevel, `AntiRaid - ${this.raidThreshold} joins in ${this.latestMembersThreshold / 1000} seconds.`);
          }, this.raidOkLevelWait);

          if (guild.me.hasPermission('KICK_MEMBERS')) {
            members.forEach(async (v, k) => {
              this.kickMember(await guild.member(k));
            });
          }
        }
      } else this.kickMember(member);
    }
  }

  private async handleMessages(member: GuildMember) {
    const channel = this.client.channels.cache.get(process.env.WELCOME_CHANNEL) as TextChannel;
    await channel
      .send(
        `${member}, welcome to the ${member.guild.name}! Please read <#${process.env.RULES_CHANNEL}> and assign yourself <#${process.env.ROLES_CHANNEL}>.\nType \`${this.client.prefix} help\` to learn how to use me, and \`${this.client.prefix} channels\` to get a quick introduction.`
      )
      .then((m) => m.delete({ timeout: 5 * 60 * 1000, reason: 'Automatic removal of welcome message.' }));

    if (!this.cachedEmbed) {
      this.cachedEmbed = new MessageEmbed()
        .setColor(process.env.DEFAULTCOLOR)
        .setTitle('Blackmagic Community')
        .setDescription("Welcome to the Blackmagic Community Discord! Here's an overview of all channels:");

      const channels = member.guild.channels.cache.filter((e) => e.type === 'text').array() as TextChannel[];
      for (const channel of channels) {
        if (hasPermission(channel))
          this.cachedEmbed.addField(
            channel.name,
            `${channel.topic ? channel.topic + '\n' : ''}[Take me there!](https://discordapp.com/channels/${member.guild.id}/${channel.id}/${
              channel.lastMessageID
            })`,
            true
          );
      }
    }

    try {
      await member.send(this.cachedEmbed);
    } catch {}
  }

  public async main(member: GuildMember): Promise<void> {
    this.client.logger.join(member);
    await this.handleRaid(member);
    await this.handleMessages(member);
  }
}
