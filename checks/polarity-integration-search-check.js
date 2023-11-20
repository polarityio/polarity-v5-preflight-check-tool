const { fileSearch } = require('../utils');

const name = 'Polarity CLI Integration Search Tool Check';

async function check(env, config, polarity, pgClient, polarityPath, logger) {
  const report = [];
  let result;

  try {
    result = await fileSearch('polarity-integration-search.sh');
    if (result) {
      report.push(`  Polarity CLI Integration Search Tool Path`);
      report.push(`    ${result}`);
    } else {
      report.push(`  polarity-integration-search.sh not found`);
    }

    return report.join('\n');
  } catch (err) {
    logger.error(err);
    return 'Error checking for polarity-integration-search.sh';
  }
}

module.exports = {
  check,
  name
};
