import { WSEventType } from 'discord.js'
import { Client } from '../core/Client'
import { EventOptions } from '../typings/typings'

export class Event {
  public client: Client;
  public name: any;
  public readonly disabled: boolean;

  constructor(client: Client, options: EventOptions) {
    Object.defineProperty(this, 'client', { value: client });
    this.disabled = options.disabled || false;
  }

  public main(...args: any[]): any {
    return true;
  }
}