const { fileSearch } = require('../utils');

const name = 'Polarity CSV Loader Check';

async function check(env, config, polarity, pgClient, polarityPath, logger) {
  const report = [];
  let result;

  try {
    result = await fileSearch('polarity-csv-loader.sh');
    if (result) {
      report.push(`  Polarity CSV Loader Path`);
      report.push(`    ${result}`);
    } else {
      report.push(`  polarity-csv-loader.sh not found`);
    }

    return report.join('\n');
  } catch (err) {
    logger.error(err);
    return 'Error checking for polarity-csv-loader.sh';
  }
}

module.exports = {
  check,
  name
};
