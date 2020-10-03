import { BaseClient, Client as client, ClientOptions as clientOptions, Collection, Invite } from 'discord.js';
import path from 'path';
import { Database } from '../database';
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
  public commands = new CommandStore();
  public events = new EventStore();
  public util = new ClientUtil(this);
  public invites = new Collection<string, Collection<string, Invite>>();
  public logger = new Logger(this);
  public readonly prefix: string = process.env.PREFIX;
  public codeBaseDir: string;
  public database: Database = new Database(this);

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
