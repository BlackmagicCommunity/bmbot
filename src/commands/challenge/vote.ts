import { toString as cronToHuman } from 'cronstrue';
import { Message } from 'discord.js';
import { Client, Command, RunArgumentsOptions } from '../../util';

export default class VoteChallengeCommand extends Command {
  constructor(client: Client) {
    super(client, {
      help: 'Starts the voting phase of the challenge',
      aliases: ['vchall', 'votephase'],
      ownerOnly: true,
    });
  }

  public async main({ message }: RunArgumentsOptions) {
    message.channel.send(
      `Are you sure? Challenges are scheduled to start vote phase \`${cronToHuman(
        this.client.settings.cronJobs.challengeVoting
      )}\`\n\nPlease confirm challenge vote phase with \`yes\` or similar.`
    );
    try {
      const res = (
        await message.channel.awaitMessages((m: Message) => m.author.id === message.author.id, { max: 1, time: 60000, errors: ['time'] })
      ).first();
      if (!['yes', 'y', 't', 'true', 'go', 'start'].includes(res.content)) return 'Challenge vote phase aborted.';

      await message.channel.send('Starting vote phase...');
      await this.client.challenge.votePhase();
      await message.reply('Vote phase has begun!');
    } catch (err) {
      this.client.logger.error('Vote Command', err.message);
    }
  }
}
