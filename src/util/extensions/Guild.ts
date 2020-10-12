import { Structures } from 'discord.js';
import { Client } from '../core/Client';
import { GuildData } from '../typings/typings';

declare module 'discord.js' {
  export interface Guild {
    data?: GuildData;
    fetchData(): Promise<Guild>;
    commitData(data: GuildData): Promise<void>;
  }
}

export default Structures.extend('Guild', (guild) => {
  class Guild extends guild {
    public client: Client;
    public data: GuildData;
    constructor(client: Client, data: any) {
      super(client, data);
    }

    public async commitData(data: GuildData) {
      const { challDesc, challMessage, challTitle, challTopic } = data;
      this.client.database.sqlite.run(
        `INSERT OR REPLACE INTO Guild (id, challTopic, challTitle, challDesc, challMessage) VALUES (?, ?, ?, ?, ?)`,
        this.id,
        challTopic,
        challTitle,
        challDesc,
        challMessage
      );

      this.data = data;
    }

    public async fetchData() {
      return new Promise<Guild>((resolve, reject) => {
        this.client.database.sqlite.get(`SELECT * FROM Guild WHERE id = ?`, [this.id], (err, row) => {
          if (err) reject(null);
          this.data = row;
          resolve(this);
        });
      });
    }
  }
  return Guild;
});
