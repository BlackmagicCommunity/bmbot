import { Invite } from 'discord.js';
import { Event } from '../util';

export default class InviteCreateEvent extends Event {
  public main(invite: Invite): any {
    // remove invite from cached invites
    this.client.invites.get(invite.guild.id).delete(invite.code);
  }
}
