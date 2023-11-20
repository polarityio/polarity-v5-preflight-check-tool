const _ = require('lodash');

const name = 'SMTP Check';

async function check(env, config, polarity, pgClient, polarityPath, logger) {
  let report = [];
  const setting = await polarity.getServerSetting('smtp');
  let enabled = _.get(setting, 'data.attributes.value.enabled', 'Not Set');

  report.push(`  SMTP Enabled: ${enabled}`);
  if (env.hasOwnProperty('POLARITY_EMAIL_INACTIVE_USERS')) {
    report.push(`  POLARITY_EMAIL_INACTIVE_USERS: ${env.POLARITY_EMAIL_INACTIVE_USERS}`);
  } else {
    report.push('  POLARITY_EMAIL_INACTIVE_USERS is not set');
  }

  return report.join('\n');
}

module.exports = {
  check,
  name
};
