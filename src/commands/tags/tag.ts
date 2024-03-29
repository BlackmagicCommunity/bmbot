import { Client, Command, RunArgumentsOptions } from '../../util';

export default class CreateTagCommand extends Command {
  constructor(client: Client) {
    super(client, {
      help: 'Replies with the tag content.',
      arguments: [{ name: 'name', type: 'string', required: true }],
      deletable: true,
    });
  }

  public async main({ args }: RunArgumentsOptions) {
    const tag = await this.client.database.tags.getTag(args.join(' '));
    if (!tag) throw new Error(`Unknown tag \`${args.join(' ')}\`.`);

    return tag.reply;
  }
}
