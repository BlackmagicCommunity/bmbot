import { capitalize } from '@reverse/string';
import { MessageEmbed } from 'discord.js';
import { Client, Command, RunArgumentsOptions } from '../../util';
import getData, { DownloadsObject, WebCrawlerData } from './web-crawler';

function formatDownloads(downloads: DownloadsObject) {
  if (!downloads) return 'Not Available';
  const s = [];
  if (downloads.windows) s.push(`[Windows](${downloads.windows})`);
  if (downloads.mac) s.push(`[Mac](${downloads.mac})`);
  if (downloads.linux) s.push(`[Linux](${downloads.linux})`);
  return s.length ? s.join('\n') : 'Not Available';
}

export class BaseVersionLookup extends Command {
  public software: keyof WebCrawlerData;

  constructor(client: Client, software: keyof WebCrawlerData) {
    super(client, {
      arguments: [
        {
          name: 'version',
          type: 'string',
        },
      ],
      help: 'Looks up a fusion or resolve version.',
      optionsData: [
        { name: 'version', description: 'Version to look for.', type: 'STRING' },
      ],
    });

    this.software = software;
  }

  public async main({ args }: RunArgumentsOptions) {
    const data = (await getData())[this.software];
    const version = args.join(' ') || data.latest;

    if (version === 'list-all') return data.versions.map((y) => y.version).join(' / ');

    const versionInfo = data.versions.find((x) => x.version === version || x.version === `${version}.0`);

    if (versionInfo) {
      const embed = new MessageEmbed()
        .setTitle(`${capitalize(this.software)} ${versionInfo.version}`)
        .setURL(versionInfo.readMoreURL)
        .setDescription(versionInfo.shortDescription)
        .addField('Free', formatDownloads(versionInfo.downloads.free), true)
        .addField('Studio', formatDownloads(versionInfo.downloads.studio), true)
        .addField(
          `Recent Versions of ${capitalize(this.software)}`,
          data.versions
            .filter((x) => x.visible)
            .map((x) => x.version)
            .join(' / '),
          true,
        )
        .setFooter('Staff does not take responsibility for download links.');
      return { embeds: [embed] };
    }
    throw new Error(`Such version of ${capitalize(this.software)} does not exist`);
  }
}
