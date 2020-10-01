import { createCanvas, registerFont, loadImage } from 'canvas'
import { Client, Command, RunArgumentsOptions, Level } from '../../util';
import { User as DUser } from 'discord.js';
import { Levels } from '../../util/database';

registerFont('src/assets/fonts/Roboto-Regular.ttf', { family: 'Roboto' });

export default class CardCommand extends Command {
  constructor(client: Client) {
    super(client, {
      help: 'Shows your profile card.',
      arguments: [
        { name: 'user', type: 'User' }
      ]
    });
  }

  public async main({ msg, args }: RunArgumentsOptions) {
    let userData: Level
    let user: DUser;
    if(!args[0]) { 
      userData = await this.client.database.levels.getUser(msg.author.id)
      user = msg.author
    } else {
      user = await this.client.util.getUser(msg, args[0]);
      if(!user) return msg.channel.send(':x: User not found.');
      userData = await this.client.database.levels.getUser(user.id);
    }

    if(!userData) return msg.channel.send(':x: User has no rank.');

    const rank =
      (await this.client.database.levels.getUsers())
        .sort((a: Level, b: Level) => {
          if (a.totalXp < b.totalXp) return 1;
          else if (a.totalXp > b.totalXp) return -1;
          else return 0;
        })
        .array()
        .findIndex((u) => u.userId === user.id) + 1;
    const neededXp = Levels.exp(userData.level);
    msg.channel.startTyping();
    const canvas = createCanvas(900, 270);
    const ctx = canvas.getContext('2d');

    // avatar
    const userImage = await loadImage(user.displayAvatarURL({ format: "png", size: 256 }));
    ctx.drawImage(userImage, 28, 60, 150, 150);

    // xp bar
    ctx.fillStyle = '#99AAB5',
    ctx.fillRect(211, 184, 371, 27);
    ctx.fillStyle = '#ff6800';
    ctx.fillRect(211, 184, (userData.currentXp / neededXp) * 371, 27);

    // background
    const card = await loadImage('src/assets/img/card.png');
    ctx.drawImage(card, 0, 0, 900, 270);

    // values
    ctx.font = '20px "Roboto"';
    ctx.fillStyle = '#ffffff'
    const xpText = `${this.client.util.formatNumber(userData.currentXp)} / ${this.client.util.formatNumber(neededXp)} XP`;
    const xpLength = ctx.measureText(xpText).width;
    ctx.fillText(xpText, 580-xpLength, 182);
    ctx.font = '60px "Roboto"';
    ctx.fillText(`#${rank}`, 211, 182);
    // Level
    ctx.fillStyle = '#ff6800'
    const levelText = `${userData.level.toString()}`;
    const levelLength = ctx.measureText(levelText).width;
    ctx.fillText(levelText, 835-levelLength, 211);
    // Level text
    ctx.font = '30px "Roboto"';
    ctx.fillText('LEVEL', 835 - levelLength - ctx.measureText("LEVEL").width, 211);

    msg.reply({ files: [ canvas.toBuffer()]});
    msg.channel.stopTyping();
  }
}