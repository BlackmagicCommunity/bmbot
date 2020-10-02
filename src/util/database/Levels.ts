import { Collection, Snowflake, User } from 'discord.js';
import fetch from 'node-fetch';
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

  public async getUserRank(id: Snowflake) {
    return new Promise((resolve) => {
      this.sqlite.get(`SELECT COUNT(*) AS 'Rank' FROM User WHERE totalXp < (SELECT totalXp FROM User WHERE id = ?)`, id, (err, row) => {
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
        }
      );
    });
  }

  private async fetchRoles() {
    return new Promise((resolve) => {
      this.sqlite.each(
        `SELECT * FROM Role ORDER BY level DESC`,
        (err, row: IRoleData) => {
          this.roles.set(row.id, row);
        },
        () => resolve()
      );
    });
  }

  public async getRolesFromLevel(level: number): Promise<Collection<Snowflake, IRoleData>> {
    if (this.roles.size === 0) await this.fetchRoles();
    const roles = this.roles.clone();
    return level === -1 ? roles : roles.filter((r) => r.level <= level);
  }
  // public async updateUser(user: User): Promise<Collection<Snowflake, Level>> {
  //   this.database.run(
  //     `UPDATE Level SET messageCount = ?, totalXp = ?, remainingXp = ?, currentXp = ?, level = ? WHERE userId = ?`,
  //     user.messageCount,
  //     user.totalXp,
  //     user.remainingXp,
  //     user.currentXp,
  //     user.level,
  //     user.userId
  //   );

  //   this._users.set(user.userId, user);
  // }

  // public async createUser(user: User) {
  //   this.database.run(
  //     `INSERT INTO Level (userId, messageCount, totalXp, remainingXp, currentXp, level) VALUES (?, ?, ?, ?, ?, ?)`,
  //     user.userId,
  //     user.messageCount,
  //     user.totalXp,
  //     user.remainingXp,
  //     user.currentXp,
  //     user.level
  //   );
  // }

  // public async updateRole(role: LevelRole): Promise<Collection<Snowflake, LevelRole>> {
  //   if (!this._roles) await this.getRoles();
  //   if (this._roles.has(role.roleId)) this.database.run(`UPDATE Role SET level = ?, single = ? WHERE roleId = ?`, role.level, role.single, role.roleId);
  //   else this.database.run(`INSERT INTO Role (roleId, level, single) VALUES (?, ?, ?)`, role.roleId, role.level, role.single);

  //   this._roles.set(role.roleId, role);
  //   return this._roles;
  // }

  // public async fetchMee6(id: Snowflake) {
  //   let amount = 0;
  //   const url = `https://mee6.xyz/api/plugins/levels/leaderboard/${id}?page=`;
  //   let page = 0;
  //   while (true) {
  //     const data = await fetch(`${url}${page++}`)
  //       .then((res) => res.json())
  //       .catch((err) => 'Service Unavailable.');
  //     if (data === 'Service Unavailable.') return data;
  //     if (data.players.length === 0) break;

  //     amount += data.players.length;
  //     data.players.forEach((u: any) => {
  //       const usr = new Level(u["id"]);
  //       usr.level = u["level"];
  //       usr.messageCount = u["message_count"];
  //       usr.totalXp = u["xp"];
  //       usr.remainingXp = u["detailed_xp"][1];
  //       usr.currentXp = u["detailed_xp"][0];

  //       this.updateUser(usr);
  //     });
  //   }

  //   return amount;
  // }
}
