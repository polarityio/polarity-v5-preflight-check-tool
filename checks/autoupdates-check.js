const _ = require('lodash');
const { rpmSearch } = require('../utils');
const semver = require('semver');

const name = 'Auto-Updates Check';

async function check(env, config, polarity, pgClient, polarityPath, logger) {
  try {
    const packageJson = require(`${polarityPath}/package.json`);
    if (semver.lt(packageJson.version, '4.3.0')) {
      return `  Auto-Updates not supported in this version of Polarity (Server: ${packageJson.version})`;
    }
  } catch (err) {
    console.warn('Warn: Could not find server package.json to determine server version');
  }

  const setting = await polarity.getServerSetting('autoupdates');
  let enabled = _.get(setting, 'data.attributes.value.enabled', 'Not Set');
  let url = _.get(setting, 'data.attributes.value.url', 'Not Set');
  return `  Auto-Updates Enabled: ${enabled}\n  Auto-Updates URL: ${url}`;
}

module.exports = {
  check,
  name
};
