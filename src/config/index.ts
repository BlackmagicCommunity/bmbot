const env = process.env.NODE_ENV || 'dev';
// eslint-disable-next-line import/no-dynamic-require
const cfg = require(`./config.${env}`);

console.log(`[ENV] ${env}`);
export default cfg;
