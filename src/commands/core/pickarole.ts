import { Collection, Snowflake, TextChannel } from 'discord.js';
import { cacheRoles, emojiRgx, roleList } from '../../events/ready';
import { Client, Command, RunArgumentsOptions } from '../../util';

export default class PickARoleCommand extends Command {
  constructor(client: Client) {
    super(client, {
      help: 'Generates the "pick a role" message(s). Easy to add and remove roles',
      arguments: [
        {
          name: 'import',
          type: 'Boolean',
        },
      ],
      aliases: ['generateroles'],
      ownerOnly: true,
    });
  }

  public async main({ msg, args: cmdArgs }: RunArgumentsOptions) {
    const channel = msg.guild.channels.cache.get(this.client.settings.channels.roles) as TextChannel;
    if (!channel) return msg.channel.send(':x: Missing role channel in client settings.');
    const roles = new Collection<string, Snowflake>(); // emote: role id
    if (cmdArgs.length && ['y', 'yes', 't', 'true', 'import'].includes(cmdArgs[0])) {
      roleList.forEach((m) => {
        m.forEach((v, k) => roles.set(k, v));
      });
    }

    const guildRoles = (await msg.guild.roles.fetch()).cache;
    do {
      await msg.channel.send(
        'Time to add a role. The format is the following:\n**:emoji: role name**\n\nYou have `20s` per response.\nSay `done` when done.'
      );
      const response = await msg.channel
        .awaitMessages((m) => m.author.id === msg.author.id, {
          max: 1,
          time: 20000,
          errors: ['time'],
        })
        .then((collected) => {
          const m = collected.first().content;
          if (['done', 'exit', 'finish'].includes(m)) return 0;
          const args = m.split(' ');
          const emoji = args.shift();
          if (!emoji.match(emojiRgx)) {
            msg.reply(`:x: Emote "${emoji}" is not valid.`);
            return 1;
          }
          const role = guildRoles.find((r) => r.name.toLowerCase() === args.join(' ').toLowerCase());
          if (!role) {
            msg.reply(`:x: Role \`${args.join(' ')}\` not found.`);
            return 1;
          }

          const roleExists = roles.get(emoji);
          if (roleExists) msg.reply(`Replaced \`${guildRoles.get(roleExists).name}\` with \`${role.name}\` for emote "${emoji}".`);
          else msg.reply(`Added \`${role.name}\` to emote "${emoji}".`);
          roles.set(emoji, role.id);

          return 1;
        })
        .catch(() => -1);

      if (response === -1) return msg.channel.send(':X: You were too slow. Try again.');
      if (response === 0) break;
      // response === 1 is continue
    } while (true);

    await msg.channel.send("Ok! Sending message...\nDon't forget to delete the other(s).");
    let count = 0;
    let txt =
      ':clapper: You can assign yourself a role here :clapper:\nThis will help others to quickly identify your interest and knowledge.\nClick the corresponding emoji to receive the role.\n\n';
    roles.forEach((v, k) => {
      // TODO: use already present emotes for imported roles
      txt += `${k} ${guildRoles.get(v).name}\n`;
      count++;

      if (count === 6 || v === roles.last()) {
        channel.send(txt);
        count = 0;
        txt = '.\n\n';
      }
    });

    await msg.channel.send('Ok! Refreshing cache...');
    await cacheRoles(this.client, false);
    await msg.channel.send('Ok! All done.');
  }
}
