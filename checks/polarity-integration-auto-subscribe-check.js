const { fileSearch } = require('../utils');

const name = 'Polarity Integration Auto Subscribe Check';

async function check(env, config, polarity, pgClient, polarityPath, logger) {
  const report = [];
  let result;

  try {
    result = await fileSearch('polarity-integration-auto-subscribe.sh');
    if (result) {
      report.push(`  Polarity Integration Auto Subscirbe Path`);
      report.push(`    ${result}`);
    } else {
      report.push(`  polarity-integration-auto-subscribe.sh not found`);
    }

    return report.join('\n');
  } catch (err) {
    logger.error(err);
    return 'Error checking for polarity-integration-auto-subscribe.sh';
  }
}

module.exports = {
  check,
  name
};
