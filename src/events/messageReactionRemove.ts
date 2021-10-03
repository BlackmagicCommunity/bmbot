import { MessageReaction, User } from 'discord.js';
import { Event } from '../util';
import { roleList } from './ready';

export default class ReactionRemoveEvent extends Event {
  public async main(reaction: MessageReaction, user: User): Promise<any> {
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;

    // it's not a reaction from the gettable list
    if (reaction.message.channel.id !== this.client.settings.channels.roles) return;
    const rID = roleList.get(reaction.message.id).get(reaction.emoji.name);
    if (!rID) return;
    const member = await reaction.message.guild.members.fetch(user.id);
    if (this.client.settings.roles.inverse.includes(rID)) await member.roles.add(rID, 'ReactionRoles - User un-reacted');
    else await member.roles.remove(rID, 'ReactionRoles - User un-reacted');
  }
}
