import { Client, Command, RunArgumentsOptions, Tag } from '../../util';

export default class CreateTagCommand extends Command {
  constructor(client: Client) {
    super(client, {
      help: 'Creates a new tag',
      aliases: ['ctag', 'ntag', 'newtag'],
      requiredPermissions: ['MANAGE_MESSAGES'],
      arguments: [
        { name: 'trigger', type: 'string', required: true },
        { name: 'reply', type: 'string', required: true },
      ],
    });
  }

  public async main({ msg, args }: RunArgumentsOptions) {
    const tag = new Tag(args[0]);
    tag.reply = args[1];
    const existed = await this.client.database.tags.getTag(tag.trigger);
    await this.client.database.tags.updateTag(tag);

    msg.channel.send(`Tag \`${tag.trigger}\` ${existed ? 'edited' : 'created'}.`);
  }
}
