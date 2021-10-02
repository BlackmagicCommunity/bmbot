import { createCanvas, loadImage, registerFont } from 'canvas';
import { Client, Command, RunArgumentsOptions } from '../../util';
import { Levels } from '../../util/database';

registerFont('src/assets/fonts/Roboto-Regular.ttf', { family: 'Roboto' });

export default class CardCommand extends Command {
  constructor(client: Client) {
    super(client, {
      help: 'Shows your profile card.',
      arguments: [{ name: 'user', type: 'User' }],
      optionsData: [{ name: 'user', description: 'User to see the card.', type: 'USER' }],
    });
  }

  public async main({ msg, args }: RunArgumentsOptions) {
    let m = msg.member;
    if (args[0]) {
      m = await this.client.util.getMember(msg, args.join(' '));
      if (!m) throw new Error(`Could not find member \`${args.join(' ')}\`.`);
    }

    const userData = await this.client.userSettings.fetchData(m.id);

    if (!userData?.totalXp) throw new Error('User has no rank.');

    const rank = await this.client.database.levels.getUserRank(m.id);
    const requiredXp = Levels.exp(userData.level);
    msg.channel.sendTyping();
    const canvas = createCanvas(900, 270);
    const ctx = canvas.getContext('2d');

    // avatar
    const userImage = await loadImage(m.user.displayAvatarURL({ format: 'png', size: 256 }));
    ctx.drawImage(userImage, 28, 60, 150, 150);

    // xp bar
    ctx.fillStyle = '#99AAB5';
    ctx.fillRect(211, 184, 371, 27);
    ctx.fillStyle = '#ff6800';
    ctx.fillRect(211, 184, (userData.currentXp / requiredXp) * 371, 27);

    // background
    const card = await loadImage('src/assets/img/card.png');
    ctx.drawImage(card, 0, 0, 900, 270);

    // values
    ctx.font = '20px "Roboto"';
    ctx.fillStyle = '#ffffff';
    const xpText = `${this.client.util.formatNumber(userData.currentXp)} / ${this.client.util.formatNumber(requiredXp)} XP`;
    const xpLength = ctx.measureText(xpText).width;
    ctx.fillText(xpText, 580 - xpLength, 182);
    ctx.font = '60px "Roboto"';
    ctx.fillText(`#${rank}`, 211, 182);
    // Level
    ctx.fillStyle = '#ff6800';
    const levelText = `${userData.level.toString()}`;
    const levelLength = ctx.measureText(levelText).width;
    ctx.fillText(levelText, 835 - levelLength, 211);
    // Level text
    ctx.font = '30px "Roboto"';
    ctx.fillText('LEVEL', 835 - levelLength - ctx.measureText('LEVEL').width, 211);

    msg.channel.sendTyping();
    return { files: [canvas.toBuffer()] };
  }
}
