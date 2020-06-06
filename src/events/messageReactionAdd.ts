import { GuildMember, MessageReaction, User } from 'discord.js';
import { Client, Event } from '../util';
import { roleList } from './ready';

export default class ReactionAddEvent extends Event {
  constructor(client: Client) {
    super(client, {});
  }

  async main(reaction: MessageReaction, user: User): Promise<any> {
    if (user.bot) return;
    if (reaction.message.channel.id !== process.env.ROLES_CHANNEL) return; // it's not a reaction from the gettable list
    const rID: string = roleList[reaction.message.id][reaction.emoji.name];
    if (!rID) return;
    const member: GuildMember = reaction.message.guild.member(user.id);
    await member.roles.add(rID, 'ReactionRoles - User reacted.');
  }
}
