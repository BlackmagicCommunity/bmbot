import { Collection, Snowflake, User as DUser } from 'discord.js';
import fetch from 'node-fetch';
import { Database } from 'sqlite3';
import { Client } from '../core/Client';
import { Role, User } from '../typings/typings';

export default class Levels {
  public client: Client;
  constructor(client: Client, database: Database) {
    Object.defineProperty(this, 'client', { value: client });
    this.database = database;
    // create tables if not exists
    this.database.run(
      [
        'CREATE TABLE IF NOT EXISTS User (',
        'id TEXT PRIMARY KEY,',
        'messageCount INTEGER,',
        'xp INTEGER,',
        'remainingXp INTEGER,',
        'level INTEGER',
        ')',
      ].join('\n')
    );

    this.database.run(
      [
        'CREATE TABLE IF NOT EXISTS Role (',
        'id TEXT PRIMARY KEY,',
        'level INTEGER,',
        'single INTEGER', // 0 - false, 1 - true
        ')',
      ].join('\n')
    );
  }
  private readonly database: Database;
  private _roles: Collection<Snowflake, Role>;
  private _users: Collection<Snowflake, User>;
  public static exp = (lvl: number) => 5 * lvl ** 2 + 50 * lvl + 100; // from mee6 source

  public getUsers(): Promise<Collection<Snowflake, User>> {
    return new Promise((resolve) => {
      if (!this._users) {
        this._users = new Collection<Snowflake, User>();

        this.database.each(
          `SELECT * FROM User`,
          (err, row: User) => this._users.set(row.id, row),
          () => resolve(this._users)
        );
      } else resolve(this._users);
    });
  }

  public async getUser(id: Snowflake): Promise<User> {
    if (!this._users) await this.getUsers();
    return this._users.get(id);
  }

  public async updateUser(user: User): Promise<Collection<Snowflake, User>> {
    if (!this._users) await this.getUsers();
    if (this._users.has(user.id))
      this.database.run(
        `UPDATE User SET messageCount = ?, xp = ?, remainingXp = ?, level = ? WHERE id = ?`,
        user.messageCount,
        user.xp,
        user.remainingXp,
        user.level,
        user.id
      );
    else
      this.database.run(
        `INSERT INTO User (id, messageCount, xp, remainingXp, level) VALUES (?, ?, ?, ?, ?)`,
        user.id,
        user.messageCount,
        user.xp,
        user.remainingXp,
        user.level
      );

    this._users.set(user.id, user);
    return this._users;
  }

  public getRoles(lvl = -1): Promise<Collection<Snowflake, Role>> {
    return new Promise((resolve) => {
      if (!this._roles) {
        this._roles = new Collection<Snowflake, Role>();

        this.database.each(
          `SELECT * FROM Role`,
          (err, row: Role) => {
            row.single = row.single === 1;
            this._roles.set(row.id, row);
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

  public async getRole(id: Snowflake): Promise<Role> {
    if (!this._roles) await this.getRoles();
    return this._roles.get(id);
  }

  public async updateRole(role: Role): Promise<Collection<Snowflake, Role>> {
    if (!this._roles) await this.getRoles();
    if (this._roles.has(role.id)) this.database.run(`UPDATE Role SET level = ?, single = ? WHERE id = ?`, role.level, role.single, role.id);
    else this.database.run(`INSERT INTO Role (id, level, single) VALUES (?, ?, ?)`, role.id, role.level, role.single);

    this._roles.set(role.id, role);
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
        const usr = new DUser(this.client, {
          id: u.id,
          discriminator: u.discriminator,
          username: u.username,
        }) as User;

        usr.level = u.level;
        usr.messageCount = u.message_count;
        usr.xp = u.xp;
        usr.remainingXp = u.detailed_xp[1];

        this.updateUser(usr);
      });
    }

    return amount;
  }
}
