import { GuildMember, MessageReaction, User } from 'discord.js';
import { Client, Event } from '../util';
import { roleList } from './ready';

export default class ReactionAddEvent extends Event {
  constructor(client: Client) {
    super(client, {});
  }

  async main(reaction: MessageReaction, user: User): Promise<any> {
    if (user.bot) return;
    const rID: string = roleList[reaction.message.id][reaction.emoji.name];
    if (!rID) return;
    const member: GuildMember = reaction.message.guild.member(user.id);
    await member.roles.add(rID);
  }
}
