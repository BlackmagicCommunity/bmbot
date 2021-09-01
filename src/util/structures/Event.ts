import { Client } from '../core/Client';

export class Event {
  public client: Client;

  public name: any;

  constructor(client: Client) {
    Object.defineProperty(this, 'client', { value: client });
  }

  // eslint-disable-next-line no-unused-vars
  public main(...args: any[]): any {
    return true;
  }
}
