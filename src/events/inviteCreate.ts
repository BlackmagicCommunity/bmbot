import { Invite } from 'discord.js';
import { Event } from '../util';

export default class InviteCreateEvent extends Event {
  public main(invite: Invite): any {
    // add invite to cached invites
    this.client.invites.get(invite.guild.id).set(invite.code, invite);
  }
}
