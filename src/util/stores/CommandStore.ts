import { Collection } from 'discord.js'
import { Command } from '../structures/command/Command'
import { AliasStore } from './AliasStore'

export class CommandStore extends Collection<string, Command> {
  public aliases: AliasStore = new AliasStore();

  constructor() {
    super();
  }

  public get(name: string) {
    return super.get(name) || this.aliases.get(name);
  }

  public has(name: string): boolean {
    return super.has(name) || this.aliases.has(name);
  }

  public set(name: string, value: Command): this {
    super.set(name, value);
    if (value.aliases.length) for (const alias of value.aliases) this.aliases.set(alias, value);
    return this;
  }

  public delete(name: string): boolean {
    const cmd = super.get(name);
    if (!cmd) return false;
    super.delete(name);
    if (cmd.aliases && cmd.aliases.length) for (const alias of cmd.aliases) this.aliases.delete(alias);
    return true;
  }

  public clear(): void {
    super.clear();
    this.aliases.clear();
  }
}