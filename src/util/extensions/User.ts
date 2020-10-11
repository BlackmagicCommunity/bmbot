import { Structures } from 'discord.js';
import { Client } from '../core/Client';
import { UserData } from '../typings/typings';

declare module 'discord.js' {
  export interface User {
    data?: UserData;
    fetchData(): Promise<User>;
    commitData(data: UserData): Promise<void>;
  }
}

export default Structures.extend('User', (user) => {
  class User extends user {
    public client: Client;
    public data: UserData = null;

    constructor(client: Client, data: any) {
      super(client, data);
    }

    public async fetchData(): Promise<User> {
      return new Promise<User>((resolve, reject) => {
        this.client.database.sqlite.get(`SELECT * FROM User WHERE id = ?`, [this.id], (err, row) => {
          if (err) reject(null);
          this.data = row;
          resolve(this);
        });
      });
    }

    public async commitData(data: UserData) {
      const { msgCount, totalXp, currentXp, level } = data;

      this.client.database.sqlite.run(
        `INSERT OR REPLACE INTO User (id, msgCount, totalXp, currentXp, level) VALUES (?, ?, ?, ?, ?)`,
        this.id,
        msgCount,
        totalXp,
        currentXp,
        level
      );
      this.data = data;
    }
  }

  return User;
});
