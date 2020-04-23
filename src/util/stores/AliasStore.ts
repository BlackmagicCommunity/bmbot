import { Collection } from 'discord.js';
import { Command } from '../structures/command/Command';

export class AliasStore extends Collection<string, Command> {}
