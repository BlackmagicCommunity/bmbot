import { Interaction, MessageEmbed } from 'discord.js';
import { Event, RunArguments } from '../util';

export default class InteractionCreateEvent extends Event {
  public async main(interaction: Interaction) {
    if (!interaction.isCommand()) return;
    if (!interaction.channel || interaction.channel.partial) {
      await this.client.channels.fetch(interaction.channelId);
    }

    // Will never happen if only guild commands are set.
    if (interaction.channel.type === 'DM') {
      await interaction.reply(`Hi ${interaction.user.username}! Sorry, but I don't work on DMs!`);
    }

    const command = this.client.commands.get(interaction.commandName);

    // Convert options to args
    const args = interaction.options.data
      .map((o) => o.value || o.user?.id || o.role?.id || o.channel?.id) as string[];

    // eslint-disable-next-line no-param-reassign
    const commandArguments = RunArguments(interaction, args);
    try {
      // TODO has to always return. can't send and edit messages
      const res = await command.handleCommand(commandArguments);
      if (res) return interaction.reply(res);
    } catch (err) {
      console.log(err);
      this.client.logger.error('Message Event', err);
      return interaction.reply({
        embeds: [new MessageEmbed()
          .setColor(this.client.settings.colors.danger)
          .setDescription(err.message),
        ],
      });
    }
  }
}
