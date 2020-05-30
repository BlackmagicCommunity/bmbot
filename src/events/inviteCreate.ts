import { Invite } from 'discord.js';
import { Client, Event } from '../util';

export default class InviteCreateEvent extends Event {
  constructor(client: Client) {
    super(client, {
      disabled: false,
    });
  }

  main(invite: Invite): any {
    // add invite to cached invites
    this.client.invites.get(invite.guild.id).set(invite.code, invite);
  }
}
