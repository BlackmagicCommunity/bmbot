import { readdirSync } from 'fs'
import { resolve as Resolve } from 'path'
import { Client } from '../Client';

export default (client: Client) => {
  try {
    readdirSync(Resolve('src/util/extensions')).forEach((file) => {
      require(Resolve('src/util/extensions', file));
    });
  } catch (e) {
    client.logger.log(e);
  }
}