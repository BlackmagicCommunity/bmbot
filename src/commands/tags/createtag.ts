import {
  Client, Command, RunArgumentsOptions, Tag,
} from '../../util';

export default class CreateTagCommand extends Command {
  constructor(client: Client) {
    super(client, {
      help: 'Creates a new tag',
      aliases: ['ctag', 'ntag', 'newtag'],
      ownerOnly: true,
      arguments: [
        { name: 'name', type: 'string', required: true },
        { name: 'reply', type: 'string', required: true },
        { name: 'description', type: 'string', required: true },
      ],
    });
  }

  public async main({ args }: RunArgumentsOptions) {
    const tag = new Tag(args[0]);
    [, tag.reply, tag.description] = args;
    const existed = await this.client.database.tags.getTag(tag.name);
    await this.client.database.tags.updateTag(tag);

    return `Tag \`${tag.name}\` ${existed ? 'edited' : 'created'}.`;
  }
}
