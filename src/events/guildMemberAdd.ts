import {
  Collection, GuildMember, MessageEmbed, Snowflake, TextChannel, VerificationLevel,
} from 'discord.js';
import { Event } from '../util';

const hasPermission = (channel: TextChannel): boolean => channel.permissionsFor(channel.guild.id).has('VIEW_CHANNEL');

export default class MemberAddEvent extends Event {
  private cachedEmbed: MessageEmbed = null;

  private raidMembersCache = new Collection<Snowflake, number>();

  private isBeingRaided = false;

  private async kickMember(member: GuildMember) {
    try {
      await member.send(this.client.settings.messages.raidKickMessage);
    } finally {
      await member.kick(
        `AntiRaid - ${this.client.settings.raid.memberCount} joins in ${this.client.settings.raid.memberJoinInterval / 1000} seconds.`,
      );
    }
  }

  private async handleRaid(member: GuildMember) {
    const now = Date.now();
    // remove all old members who joined more than x seconds ago
    this.raidMembersCache.set(member.id, now);
    // count how many joins in latest x seconds
    const members = this.raidMembersCache.filter(
      (v) => now - v <= this.client.settings.raid.memberCount,
    );
    const { guild } = member;
    if (members.size >= this.client.settings.raid.memberCount) {
      if (!this.isBeingRaided) {
        // set lockdown
        if (guild.me.permissions.has('MANAGE_GUILD')) {
          await guild.setVerificationLevel(
            this.client.settings.raid.raidVerificationLevel as VerificationLevel,
            `AntiRaid - ${this.client.settings.raid.memberCount} joins in ${this.client.settings.raid.memberJoinInterval / 1000} seconds.`,
          );
          setTimeout(() => {
            guild.setVerificationLevel(
              this.client.settings.raid.okVerificationLevel as VerificationLevel,
              `AntiRaid - ${this.client.settings.raid.memberCount} joins in ${this.client.settings.raid.memberJoinInterval / 1000} seconds.`,
            );
          }, this.client.settings.raid.okWait);

          if (guild.me.permissions.has('KICK_MEMBERS')) {
            members.forEach(async (v, k) => {
              this.kickMember(await guild.members.fetch(k));
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
        `${member}, welcome to the ${member.guild.name}! Please read <#${process.env.RULES_CHANNEL}> and assign yourself <#${process.env.ROLES_CHANNEL}>.\nType \`${this.client.settings.prefixes[0]} help\` to learn how to use me, and \`${this.client.settings.prefixes[0]} channels\` to get a quick introduction.`,
      )
      .then((m) => setTimeout(m.delete, 5 * 60 * 1000));

    if (!this.cachedEmbed) {
      this.cachedEmbed = new MessageEmbed()
        .setColor(this.client.settings.colors.info)
        .setTitle('Blackmagic Community')
        .setDescription("Welcome to the Blackmagic Community Discord! Here's an overview of all channels:");

      const channels = Array.from(member.guild.channels.cache.filter((e) => e.type === 'GUILD_TEXT').values()) as TextChannel[];
      channels.forEach((c) => {
        if (hasPermission(c)) {
          this.cachedEmbed.addField(
            c.name,
            `${c.topic ? `${c.topic}\n` : ''}[Take me there!](https://discordapp.com/channels/${member.guild.id}/${c.id}/${
              c.lastMessageId
            })`,
            true,
          );
        }
      });
    }

    try {
      await member.send({ embeds: [this.cachedEmbed] });
    } catch (err) {
      this.client.logger.error('Member Add Event', err.message, true);
    }
  }

  public async main(member: GuildMember): Promise<void> {
    this.client.logger.join(member);
    await this.handleRaid(member);
    await this.handleMessages(member);
  }
}
