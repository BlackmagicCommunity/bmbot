import { GuildMember, MessageReaction, User } from 'discord.js';
import { Client, Event } from '../util';
import { roleList } from './ready';

export default class ReactionRemoveEvent extends Event {
  constructor(client: Client) {
    super(client);
  }

  public async main(reaction: MessageReaction, user: User): Promise<any> {
    if (user.bot) return;
    if (reaction.message.channel.id !== this.client.settings.channels.roles) return; // it's not a reaction from the gettable list
    const rID = roleList.get(reaction.message.id).get(reaction.emoji.name);
    if (!rID) return;
    const member = reaction.message.guild.member(user.id);
    await member.roles.remove(rID, 'ReactionRoles - User un-reacted.');
  }
}
