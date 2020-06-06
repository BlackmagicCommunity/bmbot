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
    this.database.run(['CREATE TABLE IF NOT EXISTS Tag (', 'trigger TEXT PRIMARY KEY,', 'reply TEXT', ')'].join('\n'));
  }
  private readonly database: Database;
  private _tags: Collection<string, Tag>;

  public getTags(): Promise<Collection<string, Tag>> {
    return new Promise((resolve) => {
      if (!this._tags) {
        this._tags = new Collection<string, Tag>();

        this.database.each(
          `SELECT * FROM Tag`,
          (err, row: Tag) => this._tags.set(row.trigger, row),
          () => resolve(this._tags)
        );
      } else resolve(this._tags);
    });
  }

  public async getTag(trigger: string): Promise<Tag> {
    if (!this._tags) await this.getTags();
    return this._tags.get(trigger);
  }

  public async updateTag(tag: Tag): Promise<Collection<string, Tag>> {
    if (!this._tags) await this.getTags();
    if (this._tags.has(tag.trigger)) this.database.run(`UPDATE Tag SET reply = ? WHERE trigger = ?`, tag.reply, tag.trigger);
    else this.database.run(`INSERT INTO Tag (trigger, reply) VALUES (?, ?)`, tag.trigger, tag.reply);

    this._tags.set(tag.trigger, tag);
    return this._tags;
  }

  public async deleteTag(tag: Tag): Promise<Collection<string, Tag>> {
    if (!this._tags) await this.getTags();
    if (!this._tags.has(tag.trigger)) throw new Error(`Tag \`${tag.trigger}\` does not exist.`);
    else this.database.run(`DELETE FROM Tag WHERE trigger = ?`, tag.trigger);

    this._tags.delete(tag.trigger);
    return this._tags;
  }
}
