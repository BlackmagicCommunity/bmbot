import { Database as DB } from 'sqlite3';
import { Client } from '../core/Client';
import Levels from './Levels';
import Tags from './Tags';

export class Database {
  public client: Client;
  public sqlite: DB;
  public levels: Levels;
  public tags: Tags;

  constructor(client: Client) {
    Object.defineProperty(this, 'client', { value: client });
    this.sqlite = new DB('./bmdbot.sqlite3');
    this.levels = new Levels(client, this.sqlite);
    this.tags = new Tags(client, this.sqlite);

    this._init();
  }

  private _init(): void {
    const query = [
      'CREATE TABLE IF NOT EXISTS User (',
      'id TEXT PRIMARY KEY,',
      'msgCount INTEGER NOT NULL,',
      'totalXp INTEGER NOT NULL,',
      'currentXp INTEGER NOT NULL,',
      'level INTEGER NOT NULL',
      ');',
      'CREATE TABLE IF NOT EXISTS Role (',
      'id TEXT PRIMARY KEY,,',
      'single INTEGER NOT NULL,',
      'level INTEGER NOT NULL',
      ');',
      'CREATE TABLE IF NOT EXISTS Tag (',
      'name TEXT PRIMARY KEY,',
      'description TEXT,',
      'reply TEXT',
      ');',
    ];

    this.sqlite.run(query.join('\n'));
  }
}

export { Levels, Tags };
