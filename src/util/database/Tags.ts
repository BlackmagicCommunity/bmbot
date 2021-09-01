import { Collection } from 'discord.js';
import { Database } from 'sqlite3';
import { Client } from '../core/Client';
import { Tag } from '../structures/Tag';

export default class Tags {
  public client: Client;

  constructor(client: Client, database: Database) {
    Object.defineProperty(this, 'client', { value: client });
    this.database = database;
  }

  private readonly database: Database;

  private tags: Collection<string, Tag>;

  public getTags(): Promise<Collection<string, Tag>> {
    return new Promise((resolve) => {
      if (!this.tags) {
        this.tags = new Collection<string, Tag>();

        this.database.each(
          'SELECT * FROM Tag',
          (err, row: Tag) => this.tags.set(row.name, row),
          () => resolve(this.tags),
        );
      } else resolve(this.tags);
    });
  }

  public async getTag(name: string): Promise<Tag> {
    if (!this.tags) await this.getTags();
    return this.tags.get(name);
  }

  public async updateTag(tag: Tag): Promise<Collection<string, Tag>> {
    if (!this.tags) await this.getTags();
    if (this.tags.has(tag.name)) this.database.run('UPDATE Tag SET reply = ?, description = ? WHERE name = ?', tag.reply, tag.description, tag.name);
    else this.database.run('INSERT INTO Tag (name, reply, description) VALUES (?, ?, ?)', tag.name, tag.reply, tag.description);

    this.tags.set(tag.name, tag);
    return this.tags;
  }

  public async deleteTag(tag: Tag): Promise<Collection<string, Tag>> {
    if (!this.tags) await this.getTags();
    if (!this.tags.has(tag.name)) throw new Error(`Tag \`${tag.name}\` does not exist.`);
    else this.database.run('DELETE FROM Tag WHERE name = ?', tag.name);

    this.tags.delete(tag.name);
    return this.tags;
  }
}
