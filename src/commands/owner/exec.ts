import childProcess from 'child_process';
import { Client, Command, RunArgumentsOptions } from '../../util';

export default class ExecCommand extends Command {
  constructor(client: Client) {
    super(client, {
      aliases: ['exe', 'sudo'],
      hidden: true,
      ownerOnly: true,
      help: 'Runs bash commands on the host machine.',
    });
  }

  public async main({ msg, args }: RunArgumentsOptions) {
    childProcess.exec(args.join(' '), { shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash' }, (err, stdout, stderr) => {
      if (err) return msg.channel.send(`\`\`\`\n${err.message}\n\`\`\``);
      msg.channel.send(`\`\`\`bash\n${stdout}\n\`\`\``);
    });
  }
}
