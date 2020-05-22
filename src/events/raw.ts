import { TextChannel } from 'discord.js';
import { Client, Event } from '../util';

const events: any = {
  MESSAGE_REACTION_ADD: 'messageReactionAdd',
  MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

export default class RawEvent extends Event {
  constructor(client: Client) {
    super(client, {});
  }

  async main(event: any): Promise<any> {
    const { d: data } = event;

    if (event.t === 'MESSAGE_REACTION_ADD' || event.t === 'MESSAGE_REACTION_REMOVE') {
      const channel = (await this.client.channels.fetch(data.channel_id)) as TextChannel;
      if (channel.messages.cache.get(data.message_id)) return; // it's already cached
      const user = await this.client.users.fetch(data.user_id);
      const message = await channel.messages.fetch(data.message_id);

      const emojiKey = data.emoji.id ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
      const reaction = message.reactions.cache.get(emojiKey);

      this.client.emit(events[event.t], reaction, user);
    }
  }
}
