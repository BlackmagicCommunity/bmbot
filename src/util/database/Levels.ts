import { Collection, Snowflake } from 'discord.js';
import fetch from 'node-fetch';
import { Database } from 'sqlite3';
import { Client } from '../core/Client';
import { Level, LevelRole } from '../index';

export default class Levels {
  public client: Client;
  constructor(client: Client, database: Database) {
    Object.defineProperty(this, 'client', { value: client });
    this.database = database;
  }
  private readonly database: Database;
  private _roles: Collection<Snowflake, LevelRole>;
  private _users: Collection<Snowflake, Level>;
  public static exp = (lvl: number) => 5 * lvl ** 2 + 50 * lvl + 100; // from mee6 source

  public getUsers(): Promise<Collection<Snowflake, Level>> {
    return new Promise((resolve) => {
      if (!this._users) {
        this._users = new Collection<Snowflake, Level>();

        this.database.each(
          `SELECT * FROM Level`,
          (err, row: Level) => this._users.set(row.userId, row),
          () => resolve(this._users)
        );
      } else resolve(this._users);
    });
  }

  public async getUser(id: Snowflake): Promise<Level> {
    if (!this._users) await this.getUsers();
    return this._users.get(id);
  }

  public async updateUser(user: Level): Promise<Collection<Snowflake, Level>> {
    if (!this._users) await this.getUsers();
    if (this._users.has(user.userId))
      this.database.run(
        `UPDATE Level SET messageCount = ?, totalXp = ?, remainingXp = ?, currentXp = ?, level = ? WHERE userId = ?`,
        user.messageCount,
        user.totalXp,
        user.remainingXp,
        user.currentXp,
        user.level,
        user.userId
      );
    else
      this.database.run(
        `INSERT INTO Level (userId, messageCount, totalXp, remainingXp, currentXp, level) VALUES (?, ?, ?, ?, ?, ?)`,
        user.userId,
        user.messageCount,
        user.totalXp,
        user.remainingXp,
        user.currentXp,
        user.level
      );

    this._users.set(user.userId, user);
    return this._users;
  }

  public getRoles(lvl = -1): Promise<Collection<Snowflake, LevelRole>> {
    return new Promise((resolve) => {
      if (!this._roles) {
        this._roles = new Collection<Snowflake, LevelRole>();

        this.database.each(
          `SELECT * FROM Role`,
          (err, row: LevelRole) => {
            row.single = row.single === 1;
            this._roles.set(row.roleId, row);
          },
          () => {
            const roles = this._roles.clone();
            if (lvl !== -1) roles.filter((r) => r.level <= lvl);
            resolve(roles);
          }
        );
      } else {
        const roles = this._roles.clone();
        resolve(lvl !== -1 ? roles.filter((r) => r.level <= lvl) : roles);
      }
    });
  }

  public async getRole(id: Snowflake): Promise<LevelRole> {
    if (!this._roles) await this.getRoles();
    return this._roles.get(id);
  }

  public async updateRole(role: LevelRole): Promise<Collection<Snowflake, LevelRole>> {
    if (!this._roles) await this.getRoles();
    if (this._roles.has(role.roleId))
      this.database.run(`UPDATE Role SET level = ?, single = ? WHERE roleId = ?`, role.level, role.single, role.roleId);
    else this.database.run(`INSERT INTO Role (roleId, level, single) VALUES (?, ?, ?)`, role.roleId, role.level, role.single);

    this._roles.set(role.roleId, role);
    return this._roles;
  }

  public async fetchMee6(id: Snowflake) {
    let amount = 0;
    const url = `https://mee6.xyz/api/plugins/levels/leaderboard/${id}?page=`;
    let page = 0;
    while (true) {
      const data = await fetch(`${url}${page++}`)
        .then((res) => res.json())
        .catch((err) => 'Service Unavailable.');
      if (data === 'Service Unavailable.') return data;
      if (data.players.length === 0) break;

      amount += data.players.length;
      data.players.forEach((u: any) => {
        const usr = new Level(u.id);
        usr.level = u.level;
        usr.messageCount = u.message_count;
        usr.totalXp = u.xp;
        usr.remainingXp = u.detailed_xp[1];
        usr.currentXp = u.detailed_xp[0];

        this.updateUser(usr);
      });
    }

    return amount;
  }
}
