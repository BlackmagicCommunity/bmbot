/* eslint-disable no-console */
import chalk from 'chalk';
import { Collection, Snowflake, TextChannel } from 'discord.js';
import ora from 'ora';
import { GuildSettings } from '../util/structures/GuildSettings';
import { RoleSettings } from '../util/structures/RoleSettings';
import { UserSettings } from '../util/structures/UserSettings';
import { Challenge, Client, Event } from '../util';

const spinner = ora('Grant pre-initialisation has started...').start();

export const roleList: Collection<Snowflake, Collection<string, Snowflake>> = new Collection();

export const emojiRgx = /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/gu;

export const cacheRoles = async (client: Client, sync: boolean) => {
  const rolesChannel = (await client.channels.fetch(client.settings.channels.roles)) as TextChannel;
  const guildRoles = await rolesChannel.guild.roles.fetch();
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
      m.reactions.cache.forEach(async (reaction) => {
        // eslint-disable-next-line no-param-reassign
        if (reaction.partial) reaction = await reaction.fetch();
        const users = await reaction.users.fetch();
        const roleId = roleList.get(m.id).get(reaction.emoji.name);
        if (!roleId) {
          console.log(chalk.bgRed('Reaction Roles:'), 'A role is invalid. Check roles channel.');
          return;
        }

        const reverse = client.settings.roles.inverse.includes(roleId);

        // add role to members that don't have the role
        if (users) {
          users.forEach(async (user) => {
            try {
              const member = await m.guild.members.fetch(user.id);
              if (reverse && member.roles.cache.has(roleId)) await member.roles.remove(roleId, 'ReactionRoles - Startup Sync');
              else if (!member.roles.cache.has(roleId)) await member.roles.add(roleId, 'ReactionRoles - Startup Sync');
            } catch {
            // means the user left
              await reaction.users.remove(user.id);
            }
          });
        }

        // remove from members that un-reacted
        const role = guildRoles.get(roleId);
        role.members.forEach((u) => {
          if (!users.has(u.id) && !reverse) u.roles.remove(roleId, 'ReactionRoles - Startup Sync');
        });
      });
    }
  });
};

export default class ReadyEvent extends Event {
  public async main(): Promise<void> {
    this.client.challenge = new Challenge(this.client);
    this.client.roleSettings = new RoleSettings(this.client);
    this.client.userSettings = new UserSettings(this.client);
    this.client.guildSettings = new GuildSettings(this.client);

    spinner.succeed('Grant pre initialisation has completed.');
    spinner.start('Binding channels...');

    // add channels to logger
    try {
      this.client.logger.channel = await this.client.channels
        .fetch(this.client.settings.channels.logs).catch(() => null);
      spinner.succeed('Binding Complete.');
    } catch (err) {
      spinner.fail(`Could not bind channels:${err}`);
      process.exit(1);
    }

    // get all invites
    try {
      spinner.start('Getting all invites & caching them...');

      this.client.guilds.cache.forEach(async (guild) => {
        if (guild.me.permissions.has('MANAGE_MESSAGES')) {
          guild.invites.fetch().then((invites) => {
            this.client.invites.set(guild.id, invites);
          });
        }
      });
      spinner.succeed('All invites where cached.');
    } catch (err) {
      spinner.fail(`Could not get invites: ${err}`);
      process.exit(1);
    }

    // clean rules channel
    try {
      spinner.start('Running #rules clean...');

      const rulesChannel = (await this.client.channels
        .fetch(this.client.settings.channels.rules)) as TextChannel;

      if (rulesChannel.permissionsFor(this.client.user).has('MANAGE_MESSAGES')) {
        const rulesMessages = await rulesChannel.messages.fetch();
        rulesMessages.forEach((m) => {
          if (m.author.bot) m.delete();
        });
      }
      spinner.succeed('Rules clean completed.');
    } catch (err) {
      spinner.fail(`Could not clean #rules:${err}`);
      process.exit(1);
    }

    try {
      spinner.start('Caching roles...');
      await cacheRoles(this.client, true);
      spinner.succeed('Roles cached scesssfuly.');
    } catch (err) {
      spinner.fail(`Could not cache roles:${err}`);
      process.exit(1);
    }

    console.log(chalk.green('[INFO] Bot initialisation complete. Displaying Start Message...'));
    console.log(chalk.green(`[INFO] Hello, I'm ${this.client.user.username}, and I'm ready to rock and roll!`));
  }
}
