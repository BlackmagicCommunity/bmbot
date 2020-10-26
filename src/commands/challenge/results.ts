import { toString as cronToHuman } from 'cronstrue';
import { Message } from 'discord.js';
import { Collection } from 'discord.js';
import { Client, Command, RunArgumentsOptions } from '../../util';

export default class FinishChallengeCommand extends Command {
  constructor(client: Client) {
    super(client, {
      help: 'Posts results of running challenge.',
      aliases: ['stopchall', 'fchall', 'endchall', 'endchallenge'],
      ownerOnly: true,
    });
  }

  public async main({ message }: RunArgumentsOptions) {
    message.channel.send(
      `Are you sure? Challenges are scheduled to publish results \`${cronToHuman(
        this.client.settings.cronJobs.challengeResults
      )}\`\n\nPlease confirm challenge results with \`yes\` or similar.`
    );

    try {
      let res = (
        await message.channel.awaitMessages((m: Message) => m.author.id === message.author.id, { max: 1, time: 60000, errors: ['time'] })
      ).first();
      if (!['yes', 'y', 't', 'true', 'go', 'start'].includes(res.content)) return 'Challenge finish aborted.';

      message.channel.send('Do you want to annonce this?\n\nPlease confirm with `yes` or similar.');
      res = (
        await message.channel.awaitMessages((m: Message) => m.author.id === message.author.id, { max: 1, time: 60000, errors: ['time'] })
      ).first();

      if (!['yes', 'y', 't', 'true', 'go', 'start'].includes(res.content)) {
        const winners = await this.client.challenge.findWinners(this.client.challenge.options.message, new Collection());
        message.reply(
          `Winner(s) is/are ${winners.map((w) => `\`${w.author.tag}\` (${w.author.id})`).join(', ')} with ${winners
            .first()
            .reactions.cache.get(this.client.settings.emotes.challengeVote)} votes`
        );
      } else {
        await this.client.challenge.announceResults();
        return 'Posted!';
      }
    } catch (err) {
      return `Something went wrong:\n\`\`\`${err.message}\n\`\`\``;
    }
  }
}
