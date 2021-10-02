import { ApplicationCommandData } from 'discord.js';
import { Client, Command, RunArgumentsOptions } from '../../util';

export default class SlashCommandsCommand extends Command {
  constructor(client: Client) {
    super(client, {
      aliases: ['sc'],
      hidden: true,
      ownerOnly: true,
      guildOnly: true,
      help: 'Creates slash commands for the current guild.',
    });
  }

  public async main({ guild }: RunArgumentsOptions) {
    const commands: ApplicationCommandData[] = this.client.commands
      .filter((c) => c.optionsData && !c.hidden)
      .map((c) => ({ name: c.name, description: c.help, options: c.optionsData }));

    await guild.commands.set(commands);
    return 'Done.';
  }
}
