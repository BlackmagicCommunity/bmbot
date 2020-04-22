import { Structures } from 'discord.js'
import { Client } from '../core/Client'

export default Structures.extend('User', (user) => {
  class User extends user {
    constructor(client: Client, data: any) {
      super(client, data);
    }
  }
  return User;
})