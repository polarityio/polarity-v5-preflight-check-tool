const { fileSearch } = require('../utils');

const name = 'Polarity User Creation Check';

async function check(env, config, polarity, pgClient, polarityPath, logger) {
  const report = [];
  let result;

  try {
    result = await fileSearch('polarity-user-creation.sh');
    if (result) {
      report.push(`  Polarity User Creation Path`);
      report.push(`    ${result}`);
    } else {
      report.push(`  polarity-user-creation.sh not found`);
    }

    return report.join('\n');
  } catch (err) {
    logger.error(err);
    return 'Error checking for polarity-user-creation.sh';
  }
}

module.exports = {
  check,
  name
};
