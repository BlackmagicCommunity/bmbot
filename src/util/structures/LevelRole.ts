import { Snowflake } from 'discord.js';

export class LevelRole {
  public readonly roleId: Snowflake;
  public level: number;
  public single: number | boolean;

  constructor(roleId: Snowflake) {
    this.roleId = roleId;
  }
}
