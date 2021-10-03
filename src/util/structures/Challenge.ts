import { CronJob } from 'cron';
import {
  Collection, Message, MessageAttachment, MessageEmbed, Snowflake, TextChannel,
} from 'discord.js';
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

      this.client.guildSettings.fetchData(this.channel.guildId).then((g) => {
        if (!g) {
          this.ready = true;
          return;
        }

        const {
          challDesc, challMessage, challTitle, challTopic,
        } = g;
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
      true,
    ).start();

    new CronJob(
      this.client.settings.cronJobs.challengeResults,
      async () => {
        this.announceResults();
      },
      null,
      true,
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

  public async create({
    author, title, topic, assets, description,
  }: ChallengeOptions) {
    await this.waitUntilReady();

    const message = this.client.settings.messages.challengeStart
      .replace(/%topic%/g, topic)
      .replace(/%title%/g, title)
      .replace(/%desc%/g, description);

    // TODO: generate image
    const embed = new MessageEmbed()
      .setColor(this.client.settings.colors.info)
      .setDescription(message);
    const m = await this.channel.send({ content: `${author || this.client.user}, the all mighty, is summoning ${this.role} for a new challenge!`, embeds: [embed] });

    if (assets && assets.size) {
      try {
        await this.channel.send({ content: 'Here are the assets:', files: Array.from(assets.values()) });
      } catch (err) {
        this.client.logger.error('Challenge Create', `${err.message} - this is likely caused because attachments are too large.`);
      }
    }

    this.options = {
      description, message: m, title, topic,
    };
    await this.client.guildSettings.commitData(this.channel.guildId, {
      challDesc: description, challMessage: m.id, challTitle: title, challTopic: topic,
    });
    await this.channel.setName(`${topic.split(' ').join('-')}-challenge`, 'Challenges - Create challenge');
    await this.channel.permissionOverwrites.set(
      [
        {
          id: this.channel.guild.id,
          allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
          deny: 'ADD_REACTIONS',
        },
      ],
      'Challenges - Create challenge',
    );
  }

  public async votePhase() {
    await this.waitUntilReady();

    // lock channel
    await this.channel.permissionOverwrites.set(
      [
        {
          id: this.channel.guild.id,
          deny: ['SEND_MESSAGES', 'ADD_REACTIONS'],
        },
      ],
      'Challenges - Voting phase.',
    );

    // mass react
    const rec = async (after: string) => {
      const messages = await this.channel.messages.fetch({ limit: 100, after });
      const filtered = messages.filter(
        (m) => !m.reactions.cache.has(this.client.settings.emotes.challengeVote),
      );

      await filtered.forEach((m) => m.react(this.client.settings.emotes.challengeVote));
      if (messages.size === 100) rec(messages.last().id);
    };

    await rec(this.options.message.id);

    // Announce voting
    await this.channel.send(`${this.role} ${this.client.settings.messages.challengeVoting}`);
  }

  public async findWinners(after: Message, max: Collection<Snowflake, Message>):
  Promise<Collection<Snowflake, Message>> {
    await this.waitUntilReady();

    const messages = await after.channel.messages.fetch({ limit: 100, after: after.id });
    const bestVotes = messages.reduce((acc, val) => {
      const count = this.reactionCountFromMessage(val);
      if (count > acc) return count;
      return acc;
    }, 0);

    const maxVotes = this.reactionCountFromMessage(max.first());
    if (bestVotes > maxVotes) {
      // eslint-disable-next-line no-param-reassign
      max = messages.filter(
        (m) => this.reactionCountFromMessage(m) === bestVotes,
      );
    }

    if (messages.size === 100) return this.findWinners(messages.last(), max);
    return max;
  }

  public async announceResults() {
    await this.waitUntilReady();

    const winnersChannel = (await this.client.channels
      .fetch(this.client.settings.channels.challengeWinners)) as TextChannel;

    const winners = await this.findWinners(this.options.message, new Collection());

    let message = this.client.settings.messages.challengeWinner;
    let msgAttachment: MessageAttachment;
    if (winners.size === 1) {
      message = message
        .replace(/%title%/g, this.options.title)
        .replace(/%topic%/g, this.options.topic)
        .replace(/%mention%/g, winners.first().author.toString())
        .replace(/%messageLink%/g, `[here](${winners.first().url})`)
        .replace(/%votes%/g, this.reactionCountFromMessage(winners.first()).toString());

      const { attachments } = winners.first();
      if (attachments.size) msgAttachment = attachments.find((a) => a.size <= 8e9);
    } else {
      message = this.client.settings.messages.challengeWinners
        .replace(/%title%/g, this.options.title)
        .replace(/%topic%/g, this.options.topic)
        .replace(/%mentions%/g, winners.map((m) => `${m.author.toString()}`).join(', '))
        .replace(/%messageLinks%/g, winners.map((m) => `[${m.author.tag}](${m.url})`).join(', '))
        .replace(/%votes%/g, this.reactionCountFromMessage(winners.first()).toString());
    }

    const embed = new MessageEmbed()
      .setColor(this.client.settings.colors.info)
      .setDescription(message);

    const msgObj: {embeds: MessageEmbed[], files?: MessageAttachment[]} = { embeds: [embed] };
    if (msgAttachment) {
      embed.setImage(`attachment://${msgAttachment.name}`);
      msgObj.files = [msgAttachment];
    }

    winnersChannel.send(msgObj);
  }
}
