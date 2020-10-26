import { CronJob } from 'cron';
import { Collection, Message, MessageEmbed, Snowflake, TextChannel } from 'discord.js';
import { Client } from '../core/Client';
import { ChallengeOptions } from '../typings/typings';

export class Challenge {
  public ready = false;
  public client: Client;
  public options: ChallengeOptions;
  public channel: TextChannel;
  public role: string;

  constructor(client: Client) {
    Object.defineProperty(this, 'client', { value: client });
    this.ready = false;
    this.role = `<@&${this.client.settings.roles.challenge}>`;

    this.client.channels.fetch(this.client.settings.channels.challenges).then((c: TextChannel) => {
      this.channel = c;

      this.channel.guild.fetchData().then((g) => {
        const { challDesc, challMessage, challTitle, challTopic } = g.data;
        this.options = {
          description: challDesc,
          title: challTitle,
          topic: challTopic,
          message: null,
        };

        this.channel.messages.fetch(challMessage).then((message) => {
          this.options.message = message;

          this.ready = true;
        });
      });
    });

    // cron jobs
    new CronJob(
      this.client.settings.cronJobs.challengeVoting,
      async () => {
        this.votePhase();
      },
      null,
      true
    ).start();

    new CronJob(
      this.client.settings.cronJobs.challengeResults,
      async () => {
        this.announceResults();
      },
      null,
      true
    ).start();
  }

  private async waitUntilReady() {
    return new Promise((resolve) => {
      setInterval(() => {
        if (this.ready) resolve(true);
      }, 250);
    });
  }

  public reactionCountFromMessage(message: Message): number {
    try {
      return message.reactions.cache.get(this.client.settings.emotes.challengeVote).count;
    } catch {
      return 0;
    }
  }

  public async create({ title, topic, description }: ChallengeOptions) {
    await this.waitUntilReady();

    const message = this.client.settings.messages.challengeStart
      .replace(/%topic%/g, topic)
      .replace(/%title%/g, title)
      .replace(/%desc%/g, description);

    // TODO: generate image
    const embed = new MessageEmbed().setColor(this.client.settings.colors.info).setDescription(message);

    const m = await this.channel.send(`Calling all ${this.role}, there's a new channel in town!`, embed);
    await this.channel.guild.commitData({ challDesc: description, challMessage: m.id, challTitle: title, challTopic: topic });
    await this.channel.setName(`${topic.split(' ').join('-')}-challenge`, 'Challenges - Create challenge');
    await this.channel.overwritePermissions(
      [
        {
          id: this.channel.guild.id,
          allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
          deny: 'ADD_REACTIONS',
        },
      ],
      'Challenges - Create challenge'
    );
  }

  public async votePhase() {
    await this.waitUntilReady();

    // lock channel
    await this.channel.overwritePermissions(
      [
        {
          id: this.channel.guild.id,
          deny: ['SEND_MESSAGES', 'ADD_REACTIONS'],
        },
      ],
      'Challenges - Voting phase.'
    );

    // mass react
    const rec = async (after: string) => {
      const messages = await this.channel.messages.fetch({ limit: 100, after }, false);
      const filtered = messages.filter((m) => !m.reactions.cache.has(this.client.settings.emotes.challengeVote));
      await filtered.forEach((m) => m.react(this.client.settings.emotes.challengeVote));
      if (messages.size === 100) rec(messages.last().id);
    };

    await rec(this.options.message.id);

    // Announce voting
    await this.channel.send(`${this.role}> ${this.client.settings.messages.challengeVoting}`);
  }

  public async findWinners(after: Message, max: Collection<Snowflake, Message>): Promise<Collection<Snowflake, Message>> {
    await this.waitUntilReady();

    const messages = await after.channel.messages.fetch({ limit: 100, after: after.id }, false);
    const bestVotes = messages.reduce((acc, val) => {
      const count = this.reactionCountFromMessage(val);
      if (count > acc) return count;
      else return acc;
    }, 0);

    const maxVotes = this.reactionCountFromMessage(max.first());
    if (bestVotes > maxVotes) max = messages.filter((m) => this.reactionCountFromMessage(m) === bestVotes);

    if (messages.size === 100) return await this.findWinners(messages.last(), max);
    else return max;
  }

  public async announceResults() {
    await this.waitUntilReady();

    const channel = (await this.client.channels.fetch(this.client.settings.channels.challenges)) as TextChannel;
    const winnersChannel = (await this.client.channels.fetch(this.client.settings.channels.challengeWinners)) as TextChannel;

    const winners = await this.findWinners(this.options.message, new Collection());

    let message = this.client.settings.messages.challengeWinner;
    if (winners.size === 1) {
      message
        .replace(/%title%/g, this.options.title)
        .replace(/%topic%/g, this.options.topic)
        .replace(/%mention%/g, winners.first().author.toString())
        .replace(/%messageLink%/g, `[here](${winners.first().url})`)
        .replace(/%votes%/g, this.reactionCountFromMessage(winners.first()).toString());
    } else {
      message = this.client.settings.messages.challengeWinners
        .replace(/%title%/g, this.options.title)
        .replace(/%topic%/g, this.options.topic)
        .replace(/%mentions%/g, winners.map((m) => `${m.author.toString()}`).join(', '))
        .replace(/%messageLinks%/g, winners.map((m) => `[${m.author.tag}](${m.url})`).join(', '))
        .replace(/%votes%/g, this.reactionCountFromMessage(winners.first()).toString());
    }

    const embed = new MessageEmbed().setColor(this.client.settings.colors.info).setDescription(message);

    winnersChannel.send(embed);
    channel.send(`Hey ${this.role}! Join me as I unveil this challenge's ${winners.size === 1 ? 'winner' : 'winners'}`, embed);
  }
}
