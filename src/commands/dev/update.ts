import childProcess from 'child_process';
import { Client, Command, RunArgumentsOptions } from '../../util';

export default class UpdateCommand extends Command {
  constructor(client: Client) {
    super(client, {
      help: 'Updates the bot.',
      developerOnly: true,
      aliases: ['updt'],
    });
  }

  public async main({ msg }: RunArgumentsOptions) {
    const message = await msg.channel.send('Starting update...');
    await childProcess.exec('git pull', { shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash' }, async (err, stdout, stderr) => {
      if (stdout.includes('up to date')) return message.edit(':x: Already up to date.');
      if (err) return message.edit(':x: Something went wrong when getting pulling from github.');

      await message.edit('Pulled from github successfully. Building...');
      await childProcess.exec('npm run build', { shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash' }, async (err, stdout, stderr) => {
        if (err) return message.edit(':x: Something went wrong when building.');
        await message.edit('Done! Restarting...');
        process.exit(0);
      });
    });
  }
}
