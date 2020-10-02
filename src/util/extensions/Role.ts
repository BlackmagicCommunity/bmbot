import { Guild, Structures } from 'discord.js';
import { Client } from '../core/Client';
import { IRoleData } from '../typings/typings';

declare module 'discord.js' {
  export interface Role {
    data?: IRoleData;
    commitData(data: IRoleData): Promise<void>;
  }
}

export default Structures.extend('Role', (role) => {
  class Role extends role {
    public client: Client;
    public data: IRoleData = null;

    constructor(client: Client, data: any, guild: Guild) {
      super(client, data, guild);
    }

    public async commitData(data: IRoleData) {
      const { level, single } = data;
      this.client.database.sqlite.run(`INSERT OR REPLACE INTO Role (id, level, single) VALUES (?, ?, ?)`, this.id, level, single);
      this.data = data;
      this.client.database.levels.roles.set(this.data.id, this.data); // cache it
      this.client.database.levels.roles.sort((a, b) => b.level - a.level); // sort it
    }
  }
  return Role;
});
