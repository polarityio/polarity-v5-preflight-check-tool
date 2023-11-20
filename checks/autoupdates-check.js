const _ = require('lodash');

const name = 'Auto-Updates Check';

async function check(env, config, polarity, pgClient, polarityPath, logger) {
  const setting = await polarity.getServerSetting('autoupdates');
  let enabled = _.get(setting, 'data.attributes.value.enabled', 'Not Set');
  let url = _.get(setting, 'data.attributes.value.url', 'Not Set');
  return `  Auto-Updates Enabled: ${enabled}\n  Auto-Updates URL: ${url}`;
}

module.exports = {
  check,
  name
};
