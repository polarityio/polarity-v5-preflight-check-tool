const { fileSearch } = require('../utils');

const name = 'Polarity Annotation Manager Check';

async function check(env, config, polarity, pgClient, polarityPath, logger) {
  const report = [];
  let result;

  try {
    result = await fileSearch('polarity-annotation-manager.sh');
    if (result) {
      report.push(`  Polarity Annotation Manager Path`);
      report.push(`    ${result}`);
    } else {
      report.push(`  polarity-annotation-manager.sh not found`);
    }

    return report.join('\n');
  } catch (err) {
    logger.error(err);
    return 'Error checking for polarity-annotation-manager.sh';
  }
}

module.exports = {
  check,
  name
};
