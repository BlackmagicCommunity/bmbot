import { Message, TextChannel } from 'discord.js';
import { Client, Command, RunArgumentsOptions } from '../../util';
import { toString as cronToHuman } from 'cronstrue';

export default class StartChallengeCommand extends Command {
  constructor(client: Client) {
    super(client, {
      help: 'Starts a new challenge',
      arguments: [
        {
            name: 'topic',
            type: 'string',
            required: true
        }, {
            name: 'title',
            type: 'string',
            required: true
        }, {
          name: 'description',
          type: 'string',
          required: true
        }
      ],
      aliases: ['schall', 'createchallenge', 'addchallenge'],
      ownerOnly: true,
      guildOnly: true
    });
  }

  public async main({ message, args: [ topic, title, description ] }: RunArgumentsOptions) {
    const channel = await this.client.channels.fetch(this.client.settings.channels.challenges) as TextChannel;
    if(!channel || !channel.permissionsFor(this.client.user.id).has(['SEND_MESSAGES', 'MANAGE_CHANNELS'])) return ':x: Channel doesn\'t exist or I lack permissions.';

    const toSend = `Topic: ${topic}\nTitle: ${title}\nDescription: ${description}\n\nVoting: ${cronToHuman(this.client.settings.cronJobs.challengeVoting)} | Results: ${cronToHuman(this.client.settings.cronJobs.challengeResults)}`;
    await message.channel.send(toSend);
    message.channel.send('Please confirm challenge creation with `yes` or similar.');

    try {
      let res = (await message.channel.awaitMessages((m: Message) => m.author.id === message.author.id, { max: 1, time: 60000, errors: [ 'time' ]})).first();
      if(!['yes', 'y', 't', 'true', 'go', 'start'].includes(res.content)) return 'Challenge creation aborted.';
      await res.react('👌');

      message.guild.commitData({ challDesc: description, challStart: `${Date.now()}`, challTitle: title, challTopic: topic });
      await channel.send(toSend);
      await channel.setName(`${topic.split(' ').join('-')}-challenge`, `Challenges - Create (by ${message.author.tag})`);
      await channel.overwritePermissions([
        {
          id: message.guild.id, 
          allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
        }
      ], `Challenges - Create (by ${message.author.tag})`);
    } catch (err) {
      return `Something went wrong:\n\`\`\`${err.message}\n\`\`\``;
    }
  }
}