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
    this.database = new DB('./bmdbot.sqlite3');
    this.levels = new Levels(client, this.database);
    this.tags = new Tags(client, this.database);

    this._init();
  }

  private _init(): void {
    const query = [
      'CREATE TABLE IF NOT EXISTS "Level" (',
      '"userId"	TEXT,',
      '"messageCount"	INTEGER NOT NULL,',
      '"remainingXp"	INTEGER NOT NULL,',
      '"totalXp"	INTEGER NOT NULL,',
      '"currentXp"	INTEGER NOT NULL,',
      '"level"	INTEGER NOT NULL,',
      'PRIMARY KEY("userId")',
      ');',
      'CREATE TABLE IF NOT EXISTS "Role" (',
      '"roleId"	TEXT,',
      '"single"	INTEGER NOT NULL,',
      '"level"	INTEGER NOT NULL,',
      'PRIMARY KEY("roleId")',
      ');',
    ];

    this.database.run(query.join('\n'));
  }
}

export { Levels, Tags };
