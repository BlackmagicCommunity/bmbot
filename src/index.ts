import { Intents } from 'discord.js';
import { config as DotEnvConfig } from 'dotenv';
// ATTENTION: must be at the start
DotEnvConfig();
// eslint-disable-next-line import/first
import { Client } from './util';

// needs to be loaded before client is created
// eslint-disable-next-line import/first
import getData from './commands/software/web-crawler';

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
