import { Collection } from 'discord.js';
import { Database } from 'sqlite3';
import { Client } from '../core/Client';
import { Tag } from '../structures/Tag';

export default class Tags {
  public client: Client;
  constructor(client: Client, database: Database) {
    Object.defineProperty(this, 'client', { value: client });
    this.database = database;
    // create table if not exists
    this.database.run(['CREATE TABLE IF NOT EXISTS Tag (',
      'name TEXT PRIMARY KEY,',
      'description TEXT,',
      'reply TEXT',
      ')'].join('\n'));
  }
  private readonly database: Database;
  private _tags: Collection<string, Tag>;

  public getTags(): Promise<Collection<string, Tag>> {
    return new Promise((resolve) => {
      if (!this._tags) {
        this._tags = new Collection<string, Tag>();

        this.database.each(
          `SELECT * FROM Tag`,
          (err, row: Tag) => this._tags.set(row.name, row),
          () => resolve(this._tags)
        );
      } else resolve(this._tags);
    });
  }

  public async getTag(name: string): Promise<Tag> {
    if (!this._tags) await this.getTags();
    return this._tags.get(name);
  }

  public async updateTag(tag: Tag): Promise<Collection<string, Tag>> {
    if (!this._tags) await this.getTags();
    if (this._tags.has(tag.name)) this.database.run(`UPDATE Tag SET reply = ?, description = ? WHERE name = ?`, tag.reply, tag.description, tag.name);
    else this.database.run(`INSERT INTO Tag (name, reply, description) VALUES (?, ?, ?)`, tag.name, tag.reply, tag.description);

    this._tags.set(tag.name, tag);
    return this._tags;
  }

  public async deleteTag(tag: Tag): Promise<Collection<string, Tag>> {
    if (!this._tags) await this.getTags();
    if (!this._tags.has(tag.name)) throw new Error(`Tag \`${tag.name}\` does not exist.`);
    else this.database.run(`DELETE FROM Tag WHERE name = ?`, tag.name);

    this._tags.delete(tag.name);
    return this._tags;
  }
}
