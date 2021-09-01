import {
  Client, Command, RunArgumentsOptions, Tag,
} from '../../util';

export default class CreateTagCommand extends Command {
  constructor(client: Client) {
    super(client, {
      help: 'Creates a new tag',
      aliases: ['dtag', 'remtag', 'removetag'],
      ownerOnly: true,
      arguments: [{ name: 'name', type: 'string', required: true }],
    });
  }

  public async main({ args }: RunArgumentsOptions) {
    const tag = new Tag(args[0]);
    [, tag.reply] = args;

    try {
      await this.client.database.tags.deleteTag(tag);
      return `Tag \`${tag.name}\` deleted.`;
    } catch (err) {
      this.client.logger.error('Delete Tag Command', err.message);
    }
  }
}
