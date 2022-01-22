import {
  Client as client, ClientOptions as clientOptions, Collection, Invite,
} from 'discord.js';
import path from 'path';
import { Challenge, Logger } from '..';
import { Database } from '../database';
import { CommandStore } from '../stores/CommandStore';
import { EventStore } from '../stores/EventStore';
import { GuildSettings } from '../structures/GuildSettings';
import { RoleSettings } from '../structures/RoleSettings';
import { UserSettings } from '../structures/UserSettings';
import { ClientUtil } from '../utils/ClientUtil';
import settings from '../../config';
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

  // eslint-disable-next-line global-require
  public settings = settings.default;

  public guildSettings: GuildSettings = null;

  public userSettings: UserSettings = null;

  public roleSettings: RoleSettings = null;

  public challenge: Challenge = null;

  // eslint-disable-next-line no-shadow
  constructor(clientOptions: ClientOptions) {
    super(clientOptions);
    this.codeBaseDir = clientOptions.codeBaseDir;
  }

  public start() {
    process.on('uncaughtException', (err) => {
      this.logger.error(`Uncaught Exception - ${err.stack}`, err);
      process.exit(1);
    });

    CommandLoader(this, path.join(this.codeBaseDir, 'commands'));
    EventLoader(this, path.join(this.codeBaseDir, 'events'));

    super.login(process.env.TOKEN);
  }

  public initOnReady() {
    this.challenge = new Challenge(this);
    this.roleSettings = new RoleSettings(this);
    this.userSettings = new UserSettings(this);
    this.guildSettings = new GuildSettings(this);
  }
}
