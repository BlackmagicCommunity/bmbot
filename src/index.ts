import { config as DotEnvConfig } from 'dotenv'
import { Client } from './util'

DotEnvConfig();
new Client({
    disableMentions: 'everyone',
    presence: {
        activity: { name: 'DaVinci Resolve', type: "PLAYING" }
    }
}).start();