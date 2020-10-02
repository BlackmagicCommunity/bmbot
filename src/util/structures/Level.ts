import { Snowflake } from 'discord.js';

export class Level {
  public readonly userId: Snowflake;
  public messageCount: number;
  public level: number;
  public currentXp: number;
  public remainingXp: number;
  public totalXp: number;

  constructor(userId: Snowflake) {
    this.userId = userId;
  }
}
