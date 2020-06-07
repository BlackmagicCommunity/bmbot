import { Client, Command, RunArgumentsOptions } from '../../util';

export default class CreateTagCommand extends Command {
  constructor(client: Client) {
    super(client, {
      help: 'Uses a tag',
      arguments: [{ name: 'name', type: 'string', required: true }],
      deletable: true,
    });
  }

  public async main({ msg, args }: RunArgumentsOptions) {
    const tag = await this.client.database.tags.getTag(args[0]);
    if (!tag) return msg.react('❓');
    msg.channel.send(tag.reply);
  }
}
