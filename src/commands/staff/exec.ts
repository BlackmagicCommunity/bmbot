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

  public async main({ args }: RunArgumentsOptions) {
    childProcess.exec(args.join(' '), { shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash' }, (err, stdout) => {
      if (err) return `\`\`\`\n${err.message}\n\`\`\``;
      return `\`\`\`bash\n${stdout}\n\`\`\``;
    });
  }
}
