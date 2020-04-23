import { readdirSync } from 'fs';
import { resolve as Resolve } from 'path';
import { Client } from '../Client';

export default (client: Client, path: string) => {
  try {
    readdirSync(Resolve(path))
      .filter((x) => x.endsWith('js') || x.endsWith('ts'))
      .forEach((file) => {
        require(Resolve(path, file));
      });
  } catch (e) {
    client.logger.log(e);
  }
};
