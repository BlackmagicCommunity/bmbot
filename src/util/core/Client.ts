import { Client as client, ClientOptions } from 'discord.js';
import { CommandStore } from '../stores/CommandStore';
import { EventStore } from '../stores/EventStore';
import { Logger } from '../structures/Logger';
import { ClientUtil } from '../utils/ClientUtil';
import CommandLoader from './loaders/CommandLoader';
import EventLoader from './loaders/EventLoader';
import ExtensionsLoader from './loaders/ExtensionsLoader';

export class Client extends client {
  public commands: CommandStore = new CommandStore();
  public events: EventStore = new EventStore();
  public util: ClientUtil = new ClientUtil(this);
  public logger: Logger = new Logger();
  public readonly prefix: string = process.env.PREFIX;

  constructor(clientOptions: ClientOptions) {
    super(clientOptions);
  }

  public start(): void {
    ExtensionsLoader(this);
    CommandLoader(this, 'src/commands');
    EventLoader(this, 'src/events');
    super.login(process.env.TOKEN);
  }
}
