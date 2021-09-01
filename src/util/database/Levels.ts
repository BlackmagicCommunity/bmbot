import { Collection, Snowflake } from 'discord.js';
import { Database } from 'sqlite3';
import { Client } from '../core/Client';
import { IRoleData, UserData } from '../typings/typings';

export default class Levels {
  public client: Client;

  public readonly sqlite: Database;

  public roles = new Collection<Snowflake, IRoleData>();

  constructor(client: Client, sqlite: Database) {
    Object.defineProperty(this, 'client', { value: client });
    this.sqlite = sqlite;
  }

  public static exp = (lvl: number) => 5 * lvl ** 2 + 50 * lvl + 100; // from mee6 source

  public async getUserRank(id: Snowflake): Promise<string> {
    return new Promise((resolve) => {
      this.sqlite.get('SELECT COUNT(*) AS \'Rank\' FROM User WHERE totalXp >= (SELECT totalXp FROM User WHERE id = ?)', id, (err, row) => {
        resolve(row.Rank);
      });
    });
  }

  public async fetchLeaderboard(page = 0) {
    return new Promise<UserData[]>((resolve) => {
      const users: UserData[] = [];
      this.sqlite.each(
        `SELECT * FROM User ORDER BY totalXp DESC LIMIT ${page * 10 + 10}`,
        (err, row: UserData) => {
          users.push(row);
        },
        () => {
          resolve(users.splice(page * 10, 10));
        },
      );
    });
  }

  private async fetchRoles() {
    return new Promise<void>((resolve) => {
      this.sqlite.each(
        'SELECT * FROM Role ORDER BY level DESC',
        (err, row: IRoleData) => {
          this.roles.set(row.id, row);
        },
        () => resolve(),
      );
    });
  }

  public async getRolesFromLevel(level: number): Promise<Collection<Snowflake, IRoleData>> {
    if (this.roles.size === 0) await this.fetchRoles();
    const roles = this.roles.clone();
    return level === -1 ? roles : roles.filter((r) => r.level <= level);
  }
}
