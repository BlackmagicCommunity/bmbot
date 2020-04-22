import { Collection } from 'discord.js';
import { Event } from '../structures/Event';

export class EventStore extends Collection<string, Event> {}
