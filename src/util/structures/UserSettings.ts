import { Snowflake } from 'discord.js';
import { Client } from '../core/Client';
import { UserData } from '../typings/typings';

export class UserSettings {
    public data: UserData;

    public client: Client;

    constructor(client: Client) {
      Object.defineProperty(this, 'client', { value: client });
    }

    public async fetchData(userId: Snowflake) {
      return new Promise<UserData>((resolve, reject) => {
        this.client.database.sqlite.get('SELECT * FROM User WHERE id = ?', [userId], (err, row) => {
          if (err) reject();
          this.data = row;
          resolve(row);
        });
      });
    }

    public async commitData(userId: Snowflake, data: UserData) {
      const {
        msgCount, totalXp, currentXp, level,
      } = data;

      this.client.database.sqlite.run(
        'INSERT OR REPLACE INTO User (id, msgCount, totalXp, currentXp, level) VALUES (?, ?, ?, ?, ?)',
        userId,
        msgCount,
        totalXp,
        currentXp,
        level,
      );
      this.data = data;
    }
}
