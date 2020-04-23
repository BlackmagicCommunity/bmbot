import { readdirSync } from 'fs';
import { resolve as Resolve } from 'path';
import { Command } from '../../structures/command/Command';
import { Client } from '../Client';

export default (client: Client, path: string): void => {
  try {
    readdirSync(Resolve(path)).forEach((folder) => {
      readdirSync(Resolve(path, folder)).forEach((file) => {
        const commandFile: any = require(Resolve(path, folder, file)).default;
        if (!commandFile) return;
        if (!(commandFile.prototype instanceof Command)) return;
        const command: Command = new commandFile(client);
        command.name = file.slice(0, -3);
        command.category = folder;
        client.commands.set(command.name, command);
      });
    });
  } catch (e) {
    client.logger.log(e);
  }
};
