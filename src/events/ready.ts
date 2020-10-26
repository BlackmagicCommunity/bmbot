import { Collection, Snowflake, TextChannel } from 'discord.js';
import { Challenge, Client, Event } from '../util';

const ora = require('ora');
const chalk = require('chalk')

const spinner = ora("GrantBot pre initialisation has started...").start();


export let roleList: Collection<Snowflake, Collection<string, Snowflake>> = new Collection();

export const emojiRgx = /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/gu;

export const cacheRoles = async (client: Client, sync: boolean) => {
  const rolesChannel = (await client.channels.fetch(client.settings.channels.roles)) as TextChannel;
  const guildRoles = (await rolesChannel.guild.roles.fetch()).cache;
  const rolesMessages = await rolesChannel.messages.fetch();
  await rolesMessages.forEach((m) => {
    roleList.set(m.id, new Collection());
    // add roles to roleList
    const content = m.content.split('\n');
    content.forEach((a) => {
      const args = a.split(' ');
      const emoji = args[0];
      args.shift();
      const emojis = emoji.match(emojiRgx);
      if (!emojis) return;
      const role = guildRoles.find((r) => r.name === args.join(' '));
      if (!role) return;
      roleList.get(m.id).set(emoji, role.id);
    });

    // sync
    if (sync && rolesChannel.permissionsFor(client.user).has('MANAGE_ROLES')) {
      m.reactions.cache.forEach(async (rs) => {
        const users = await rs.users.fetch();
        const r = roleList.get(m.id).get(rs.emoji.name);

        // add role to members that don't have the role
        if (users)
          users.forEach((u) => {
            const member = m.guild.member(u.id);
            if (!member) return rs.users.remove(u.id);
            member.roles.add(r, 'ReactionRoles - Startup Sync');
          });

        // remove from members that un-reacted
        const role = guildRoles.get(r);
        role.members.forEach((u) => {
          if (!users.has(u.id)) u.roles.remove(r, 'ReactionRoles - Startup Sync');
        });
      });
    }
  });
};

export default class ReadyEvent extends Event {
  constructor(client: Client) {
    super(client);
  }

  public async main(): Promise<void> {
    this.client.challenge = new Challenge(this.client);
    spinner.succeed("GrantBot pre initialisation has completed.") 
    spinner.start("Binding channels.")
    // add channels to logger
    this.client.logger.channels.joins = await this.client.channels.fetch(this.client.settings.channels.logJoins).catch((_) => null);
    this.client.logger.channels.infractions = await this.client.channels.fetch(this.client.settings.channels.logJoins).catch((_) => null);
    this.client.logger.channels.messages = await this.client.channels.fetch(this.client.settings.channels.logMessages).catch((_) => null);
    spinner.succeed("Binding Complete.")
    spinner.start("Getting All Invites & Adding them to DB.")
    // get all invites
    this.client.guilds.cache.forEach((guild) => {
      if (guild.me.permissions.has('MANAGE_MESSAGES')) {
        guild.fetchInvites().then((invites) => {
          this.client.invites.set(guild.id, invites);
        });
      }
    });
    spinner.succeed("All invites where grabed.")
    spinner.start("Running StartupClean")
    // clean rules channel
    const rulesChannel = (await this.client.channels.fetch(this.client.settings.channels.rules)) as TextChannel;
    if (rulesChannel.permissionsFor(this.client.user).has('MANAGE_MESSAGES')) {
      const rulesMessages = await rulesChannel.messages.fetch();
      rulesMessages.forEach((m) => {
        if (m.author.bot) m.delete({ reason: 'WelcomeMessages - Startup Clean' });
      });
    }
    spinner.succeed("StartupClean Completed.")
    spinner.start("Awaiting cacheRoles() to finsh..")

    await cacheRoles(this.client, true);

    spinner.succeed("Roles Cached Sucesssfuly.")
    console.log(chalk.green("[INFO] Bot initialisation complete. Displying Start Message..."))
    console.log(chalk.green(`[INFO] Hello, I'm ${this.client.user.username}, and I'm ready to rock and roll!`));
    return;
  }
}
