import { readdirSync } from 'fs';
import { resolve as Resolve } from 'path';
import { Event } from '../../structures/Event';
import { Client } from '../Client';

export default async (client: Client, path: string) => {
  try {
    readdirSync(Resolve(path))
      .filter((x) => x.endsWith('js') || x.endsWith('ts'))
      .forEach((file) => {
        const eventFile: any = require(Resolve(path, file)).default;
        const event: Event = new eventFile(client);
        event.name = file.slice(0, -3);
        client.events.set(event.name, event);
        client.on(event.name, (...args: any): Promise<any | void> => event.main(...args));
      });
  } catch (err) {
    client.logger.error('Event Loader', err.message);
  }
};
