import { inspect } from 'util';
import { Client, Command, RunArgumentsOptions } from '../../util';

const evalGlobals = ['discord.js'].map(require);

// tslint:disable: no-var-requires
const assert = require('assert');
// tslint:disable-next-line: variable-name
const child_process = require('child_process');
const Discord = require('discord.js');
const fetch = require('node-fetch');
const fs = require('fs-extra');
const knowledge = require('knowledge');
const os = require('os');
const path = require('path');
const util = require('util');
const crawl = require('../software/web-crawler').default;
// tslint:enable: no-var-requires

export default class EvalCommand extends Command {
  constructor(client: Client) {
    super(client, {
      aliases: ['e', 'js'],
      hidden: true,
      ownerOnly: true,
      help: 'Runs JS code',
      arguments: [
        {
          all: true,
          name: 'code',
          type: 'code',
        },
      ],
    });
  }

  public async main(runArguments: RunArgumentsOptions) {
    this.getEval(runArguments).then((msg) => runArguments.message.channel.send(msg));
  }

  public async getEval({ message, args }: RunArgumentsOptions) {
    const code = args.join(' ');
    const msg = message;
    const client = message.client;
    const guild = message.guild;

    try {
      // tslint:disable-next-line:no-eval
      const evaled = eval(
        `(g)=>{${evalGlobals
          .map((module, i) =>
            Object.keys(module)
              .map((key) => `const ${key}=g[${i}]['${key}']`)
              .join(';')
          )
          .join(';')};return eval(\`${code.replace(/(\\|`)/g, '\\$1')}\`)}`
      )(evalGlobals);
      let ogeval = evaled;
      if (evaled instanceof Promise) ogeval = await ogeval;
      if (typeof evaled !== 'string') ogeval = inspect(ogeval, { depth: 0, showHidden: true });
      if (ogeval === null) ogeval = undefined;
      const cleanEval = this.client.util.clean(ogeval);

      if (ogeval.length > 1950) {
        return `\`Output:\` **Evaled code was too long**`;
      }
      const type = this.getComplexType(evaled).type;
      return `**Typeof:** \`${type}\`\n\n\`Output:\`\n\`\`\`js\n${cleanEval} \`\`\``;
    } catch (err) {
      return `\`Error:\`\n\`\`\`js\n${err.name}: ${err.message}\`\`\``;
    }
  }

  private getType(value: any) {
    if (value === null) return String(value);
    return typeof value;
  }

  private getComplexType(value: any) {
    const basicType = this.getType(value);
    if (basicType === 'object' || basicType === 'function') return { basicType, type: this.getClass(value) };
    return { basicType, type: basicType };
  }

  private getClass(value: any) {
    return value && value.constructor && value.constructor.name ? value.constructor.name : {}.toString.call(value).match(/\[object (\w+)\]/)[1];
  }
}
