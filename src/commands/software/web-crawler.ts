// dave caruso 2020-03-17, updated to ts 2020-04-22
import DomParser from 'dom-parser';
import Cache from 'node-cache';
import fetch from 'node-fetch';

const parser = new DomParser();
// two hour cache
const cache = new Cache({ stdTTL: 60 * 60 * 2 });

const BM_BASE_URL = 'https://www.blackmagicdesign.com';
const BM_VERSION_LIST = '/support/partial/downloads';

export interface WebCrawlerData {
  fusion: VersionHistory;
  resolve: VersionHistory;
}
export interface VersionHistory {
  latest: string;
  versions: Version[];
}
export interface Version {
  visible: boolean;
  date: string;
  version: string;
  shortDescription: string;
  readMoreURL: string;
  downloads: {
    studio: null | DownloadsObject;
    free: null | DownloadsObject;
  };
}
export interface DownloadsObject {
  windows?: string;
  mac?: string;
  linux?: string;
}

async function crawl(): Promise<WebCrawlerData> {
  // fetch html text
  const text = await fetch(BM_BASE_URL + BM_VERSION_LIST).then((response) => response.text());
  // parse it
  const dom = parser.parseFromString(text);

  // grab a list of each <article>, aka each download.
  const versionNodes = dom
    .getElementsByTagName('article')
    // remove non resolve and non-fusion stuff
    .filter((x) => x.getAttribute('families') === 'davinci-resolve-and-fusion')
    // remove fusion connect downloads
    .filter((x) => !x.getElementsByTagName('h4')[0].innerHTML.includes('Fusion Connect'))
    // remove fairlight sound pack downloads
    .filter((x) => !x.getElementsByTagName('h4')[0].innerHTML.includes('Fairlight Sound'))
    // remove eGPU downloads
    .filter((x) => !x.getElementsByTagName('h4')[0].innerHTML.includes('eGPU'));

  // transform each version node into a json object
  const transformedVersionNodes = versionNodes.map((rootNode) => {
    // grab title, it is used a lot here.
    const title = rootNode.getElementsByTagName('h4')[0].innerHTML;
    // date is a <p>
    const date = rootNode.getElementsByClassName('date')[0].innerHTML;

    // the description is a <p> with two elements
    const description = rootNode.getElementsByClassName('description')[0];
    const shortDescription = description.getElementsByTagName('span')[0].innerHTML;
    const readMore = description.getElementsByTagName('a')[0];
    const readMoreURL = readMore ? BM_BASE_URL + readMore.getAttribute('href') : null;

    // get program name, version, and studio version
    const type = title.includes('Fusion') ? 'fusion' : 'resolve';
    const version = title.match(/ ([0-9.]+)/)[1];
    const studio = title.includes('Studio');

    // downloads are <a> tags in the second <div class="group">
    const downloadsRootNode = rootNode.getElementsByClassName('group')[1];
    // assemble the download links
    const downloads = downloadsRootNode.getElementsByTagName('a').reduce((obj, node) => {
      const platform = node.getAttribute('class').split(' ')[1] as keyof DownloadsObject;
      const url = BM_BASE_URL + node.getAttribute('href');

      obj[platform] = encodeURI(url);

      return obj;
    }, {} as DownloadsObject);

    const filteredDesc = shortDescription
      .replace(/  +/g, ' ')
      .replace('Technical support for the free version of DaVinci Resolve 16 is only available via the Blackmagic Design community forums.', '')
      .split('')
      .reverse()
      .join('')
      .replace(/^.* elgnod .*? \./, '.')
      .split('')
      .reverse()
      .join('');

    return {
      type,
      version,
      date,
      shortDescription: filteredDesc,
      readMoreURL,
      studio,
      downloads,
    };
  });

  // latest versions
  const latestFusion = transformedVersionNodes.find((x) => x.type === 'fusion').version;
  const latestResolve = transformedVersionNodes.find((x) => x.type === 'resolve').version;

  const visibleFusionMajor = [latestFusion.split('.')[0], null];
  const visibleResolveMajor = [latestResolve.split('.')[0], null];

  // now we will combine everything into a two objects with keys for the versions
  const fusionVersions = new Map();
  const resolveVersions = new Map();

  transformedVersionNodes.forEach((release) => {
    const obj = release.type === 'fusion' ? fusionVersions : resolveVersions;
    const visibleMajors = release.type === 'fusion' ? visibleFusionMajor : visibleResolveMajor;

    if (!obj.has(release.version)) {
      let isVisible = visibleMajors.includes(release.version.split('.')[0]);
      if (!isVisible && !visibleMajors[1]) {
        visibleMajors[1] = release.version.split('.')[0];
        isVisible = true;
      }

      // copy all the alike metadata
      obj.set(release.version, {
        visible: isVisible,
        date: release.date,
        version: release.version,
        shortDescription: release.shortDescription,
        readMoreURL: release.readMoreURL,
        downloads: {
          studio: null,
          free: null,
        },
      });
    }

    const mapped = obj.get(release.version);
    mapped.downloads[release.studio ? 'studio' : 'free'] = release.downloads;
    if (release.studio) {
      mapped.readMoreURL = release.readMoreURL;
    }
  });

  return {
    fusion: {
      latest: latestFusion,
      versions: Array.from(fusionVersions.values()),
    },
    resolve: {
      latest: latestResolve,
      versions: Array.from(resolveVersions.values()),
    },
  };
}

export default async function getData(): Promise<WebCrawlerData> {
  if (cache.has('data')) {
    return cache.get('data');
  }
  const data = await crawl();
  cache.set('data', data);
  return data;
}
