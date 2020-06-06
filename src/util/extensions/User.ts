import { Structures } from 'discord.js';
import { Client } from '../core/Client';

export default Structures.extend('User', (user) => {
  class User extends user {
    public messageCount: number;
    public xp: number;
    public remainingXp: number;
    public level: number;

    constructor(client: Client, data: any) {
      super(client, data);
    }
  }

  return User;
});
