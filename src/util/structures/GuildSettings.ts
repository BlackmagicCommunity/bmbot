import { Snowflake } from 'discord.js';
import { Client } from '../core/Client';
import { GuildData } from '../typings/typings';

export class GuildSettings {
    public data: GuildData;

    public client: Client;

    constructor(client: Client) {
      Object.defineProperty(this, 'client', { value: client });
    }

    public async commitData(guildId: Snowflake, data: GuildData) {
      const {
        challDesc, challMessage, challTitle, challTopic,
      } = data;
      this.client.database.sqlite.run(
        'INSERT OR REPLACE INTO Guild (id, challTopic, challTitle, challDesc, challMessage) VALUES (?, ?, ?, ?, ?)',
        guildId,
        challTopic,
        challTitle,
        challDesc,
        challMessage,
      );

      this.data = data;
    }

    public async fetchData(guildId: Snowflake) {
      return new Promise<GuildData>((resolve, reject) => {
        this.client.database.sqlite.get('SELECT * FROM Guild WHERE id = ?', [guildId], (err, row) => {
          if (err) reject();
          this.data = row;
          resolve(row);
        });
      });
    }
}
