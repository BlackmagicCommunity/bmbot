import { Interaction } from 'discord.js';
import { Event } from '../util';

export default class InteractionCreateEvent extends Event {
  public async main(interaction: Interaction) {
    if (!interaction.isCommand()) return;
    if (!interaction.channel || interaction.channel.partial) {
      await this.client.channels.fetch(interaction.channelId);
    }

    if (interaction.channel.type === 'DM') {
      await interaction.reply(`Hi ${interaction.user.username}! Sorry, but I don't work on DMs!`);
    }
  }
}
