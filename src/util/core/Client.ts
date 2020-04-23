import { Client as client, ClientOptions as clientOptions } from 'discord.js';
import path from 'path';
import { CommandStore } from '../stores/CommandStore';
import { EventStore } from '../stores/EventStore';
import { Logger } from '../structures/Logger';
import { ClientUtil } from '../utils/ClientUtil';
import CommandLoader from './loaders/CommandLoader';
import EventLoader from './loaders/EventLoader';
import ExtensionsLoader from './loaders/ExtensionsLoader';

interface ClientOptions extends clientOptions {
  codeBaseDir: string;
}

export class Client extends client {
  public commands: CommandStore = new CommandStore();
  public events: EventStore = new EventStore();
  public util: ClientUtil = new ClientUtil(this);
  public logger: Logger = new Logger();
  public readonly prefix: string = process.env.PREFIX;
  public codeBaseDir: string;

  constructor(clientOptions: ClientOptions) {
    super(clientOptions);
    this.codeBaseDir = clientOptions.codeBaseDir;
  }

  public start(): void {
    ExtensionsLoader(this, path.join(__dirname, '../extensions'));
    CommandLoader(this, path.join(this.codeBaseDir, 'commands'));
    EventLoader(this, path.join(this.codeBaseDir, 'events'));
    super.login(process.env.TOKEN);
  }
}
