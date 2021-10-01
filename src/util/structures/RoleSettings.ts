import { Snowflake } from 'discord.js';
import { Client } from '../core/Client';
import { IRoleData } from '../typings/typings';

export class RoleSettings {
    public data: IRoleData;

    public client: Client;

    constructor(client: Client) {
      Object.defineProperty(this, 'client', { value: client });
    }

    public async commitData(roleId: Snowflake, data: IRoleData) {
      const { level, single } = data;
      this.client.database.sqlite.run('INSERT OR REPLACE INTO Role (id, level, single) VALUES (?, ?, ?)', roleId, level, single);
      this.data = data;
      // todo implement insertion sort
      this.client.database.levels.roles.set(this.data.id, this.data); // cache it
      this.client.database.levels.roles = this.client.database.levels.roles
        .sort((a, b) => b.level - a.level); // sort it
    }
}
