import { toString as cronToHuman } from 'cronstrue';
import { Message, TextChannel } from 'discord.js';
import { Client, Command, RunArgumentsOptions } from '../../util';

export default class StartChallengeCommand extends Command {
  constructor(client: Client) {
    super(client, {
      help: 'Starts a new challenge',
      arguments: [
        {
          name: 'topic',
          type: 'string',
          required: true,
        },
        {
          name: 'title',
          type: 'string',
          required: true,
        },
        {
          name: 'description',
          type: 'string',
          required: true,
        },
      ],
      aliases: ['schall', 'createchallenge', 'addchallenge'],
      ownerOnly: true,
      guildOnly: true,
    });
  }

  public async main({ message, args: [topic, title, description] }: RunArgumentsOptions) {
    const channel = (await this.client.channels
      .fetch(this.client.settings.channels.challenges)) as TextChannel;
    if (!channel || !channel.permissionsFor(this.client.user.id).has(['SEND_MESSAGES', 'MANAGE_CHANNELS'])) throw new Error("Channel doesn't exist or I lack permissions.");

    const toSend = `Topic: ${topic}\nTitle: ${title}\nDescription: ${description}\n\nVoting: ${cronToHuman(
      this.client.settings.cronJobs.challengeVoting,
    )} | Results: ${cronToHuman(this.client.settings.cronJobs.challengeResults)}`;
    await message.channel.send(toSend);
    message.channel.send('Please confirm challenge creation with `yes` or similar.');

    try {
      const res = (
        await message.channel.awaitMessages({
          filter: (m: Message) => m.author.id === message.author.id, max: 1, time: 60000, errors: ['time'],
        })
      ).first();
      if (!['yes', 'y', 't', 'true', 'go', 'start'].includes(res.content)) throw new Error('Challenge creation aborted.');

      await this.client.challenge.create({
        author: message.author,
        title,
        topic,
        description,
        assets: message.attachments,
        message: null,
      });

      return '👌';
    } catch (err) {
      this.client.logger.error('Start Command', err.message);
    }
  }
}
