import { Intents } from 'discord.js';
import { config as DotEnvConfig } from 'dotenv';
import { Client } from './util';

// needs to be loaded before client is created
import getData from './commands/software/web-crawler';
import './util/extensions/Guild';
import './util/extensions/Message';
import './util/extensions/Role';
import './util/extensions/User';

DotEnvConfig();

getData().then((data) => {
  new Client({
    partials: ['REACTION'],
    intents: [Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
    presence: {
      activities: [{ name: `DaVinci Resolve ${data.resolve.latest}`, type: 'PLAYING' }],
    },
    codeBaseDir: __dirname,
  }).start();
});
