import { config as DotEnvConfig } from 'dotenv';
import { Client } from './util';

DotEnvConfig();

// needs to be loaded before client is created
import getData from './commands/software/web-crawler';
import './util/extensions/Guild';
import './util/extensions/Message';
import './util/extensions/Role';
import './util/extensions/User';

getData().then((data) => {
  new Client({
    partials: ['REACTION'],
    disableMentions: 'everyone',
    presence: {
      activity: { name: `DaVinci Resolve ${data.resolve.latest}`, type: 'PLAYING' },
    },
    codeBaseDir: __dirname,
  }).start();
});
