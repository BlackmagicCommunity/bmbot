/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import { readdirSync } from 'fs';
import { resolve as Resolve } from 'path';
import { Command } from '../../structures/command/Command';
import { Client } from '../Client';

const upperFirst = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export default (client: Client, path: string): void => {
  try {
    readdirSync(Resolve(path)).forEach((folder) => {
      readdirSync(Resolve(path, folder))
        .filter((x) => x.endsWith('js') || x.endsWith('ts'))
        .forEach((file) => {
          const commandFile: any = require(Resolve(path, folder, file)).default;
          if (!commandFile) return;
          if (!(commandFile.prototype instanceof Command)) return;
          // eslint-disable-next-line new-cap
          const command: Command = new commandFile(client);
          command.name = file.slice(0, -3);
          command.category = upperFirst(folder);
          client.commands.set(command.name, command);
        });
    });
  } catch (err) {
    client.logger.error('Command Loader', err.message);
  }
};
