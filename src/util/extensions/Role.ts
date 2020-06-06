import { Guild, Structures } from 'discord.js';
import { Client } from '../core/Client';

export default Structures.extend('Role', (role) => {
  class Role extends role {
    public level = 0;
    public single = false;

    constructor(client: Client, data: any, guild: Guild) {
      super(client, data, guild);
    }
  }
  return Role;
});
