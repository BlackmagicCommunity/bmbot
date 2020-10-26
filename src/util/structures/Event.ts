import { WSEventType } from 'discord.js';
import { Client } from '../core/Client';

export class Event {
  public client: Client;
  public name: any;

  constructor(client: Client) {
    Object.defineProperty(this, 'client', { value: client });
  }

  public main(...args: any[]): any {
    return true;
  }
}
