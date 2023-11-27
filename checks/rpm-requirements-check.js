const { rpmSearch } = require('../utils');

const name = 'RPM requirements check';

async function check(env, config, polarity, pgClient, polarityPath, logger) {
  const report = [];
  let result;

  try {
    result = await rpmSearch('jq');
    if (result) {
      report.push(`  jq RPMs`);
      let tokens = result.split('\n');
      tokens.forEach((token, index) => {
        report.push(`    ${token}`);
      });
    } else {
      report.push(`  jq RPMs not found`);
    }

    return report.join('\n');
  } catch (err) {
    logger.error(err);
    return '  Error checking required RPMs';
  }
}

module.exports = {
  check,
  name
};
