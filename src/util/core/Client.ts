import { Client as client, ClientOptions as clientOptions, Collection, Invite } from 'discord.js';
import path from 'path';
import { Challenge, Logger } from '..';
import settings from '../../settings';
import { Database } from '../database';
import { CommandStore } from '../stores/CommandStore';
import { EventStore } from '../stores/EventStore';
import { ClientUtil } from '../utils/ClientUtil';
import CommandLoader from './loaders/CommandLoader';
import EventLoader from './loaders/EventLoader';

interface ClientOptions extends clientOptions {
  codeBaseDir: string;
}

export class Client extends client {
  public commands = new CommandStore();
  public events = new EventStore();
  public util = new ClientUtil(this);
  public invites = new Collection<string, Collection<string, Invite>>();
  public logger = new Logger(this);
  public codeBaseDir: string;
  public database = new Database(this);
  public settings = settings;
  public challenge: Challenge = null;

  constructor(clientOptions: ClientOptions) {
    super(clientOptions);
    this.codeBaseDir = clientOptions.codeBaseDir;
  }

  public start(): void {
    process.on('uncaughtException', (err) => {
      this.logger.error(`Uncaught Exception - ${err.stack}`, err.message);
    });

    CommandLoader(this, path.join(this.codeBaseDir, 'commands'));
    EventLoader(this, path.join(this.codeBaseDir, 'events'));
    super.login(process.env.TOKEN);
  }
}
