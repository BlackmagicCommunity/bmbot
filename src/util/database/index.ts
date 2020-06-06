import { Database as DB } from 'sqlite3';
import { Client } from '../core/Client';
import Levels from './Levels';
import Tags from './Tags';

export class Database {
  public client: Client;
  private database: DB;
  public levels: Levels;
  public tags: Tags;

  constructor(client: Client) {
    Object.defineProperty(this, 'client', { value: client });
    this.database = new DB('./database.sqlite3');
    this.levels = new Levels(client, this.database);
    this.tags = new Tags(client, this.database);
  }
}

export { Levels, Tags };
