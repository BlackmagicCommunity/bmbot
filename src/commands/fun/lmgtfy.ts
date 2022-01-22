import { TextChannel } from 'discord.js';
import { Client, Command, RunArgumentsOptions } from '../../util';

export default class LMGTFYCommand extends Command {
  constructor(client: Client) {
    super(client, {
      aliases: ['google'],
      help: 'Someone asking a question they could simply google?',
      deletable: true,
      arguments: [
        {
          name: 'query | link',
          type: 'string | url',
        },
      ],
      optionsData: [{
        name: 'query', type: 'STRING', description: 'Search query.',
      }],
    });
  }

  public async main({ msg, args }: RunArgumentsOptions) {
    let query: string[];

    if (!args[0]) {
      // previous message
      const message = (await msg.channel.messages.fetch({ limit: 2 })).last();
      query = message.content?.split(' ');
      if (!query) throw new Error('Nothing to search.');
    } else {
      const str = args.join(' ');
      const matches = str.match('https://(canary.)?(discord.com|discordapp.com)/channels/([0-9]{16,18})/([0-9]{16,18})/([0-9]{16,18})');
      if (!matches) query = args;
      else {
        const [, , , guildId, channelId, messageId] = matches;

        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) throw new Error('Guild not found.');
        const channel = guild.channels.cache.get(channelId) as TextChannel;
        if (!channel) throw new Error('Channel not found.');
        const message = await channel.messages.fetch(messageId).catch(() => null);
        if (!message) throw new Error('Message not found.');
        query = message.content.split(' ');
      }
    }

    const uri = query.map(encodeURIComponent).join('+');
    return `We're happy to help you on questions that are not easy to google.\n<https://lmgtfy.com/?q=${uri}>`;
  }
}
