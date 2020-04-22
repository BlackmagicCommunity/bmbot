import { Structures } from 'discord.js'
import { Client } from '../core/Client'

export default Structures.extend('Guild', (guild) => {
  class Guild extends guild {
    constructor(client: Client, data: any) {
      super(client, data);
    }
  }
  return Guild;
});