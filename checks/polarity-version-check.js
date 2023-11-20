const { rpmSearch } = require('../utils');

const name = 'Polarity Version Check';

async function check(env, config, polarity, pgClient, polarityPath, logger) {
  const report = [];
  let result;

  try {
    result = await rpmSearch('polarity');
    if (result) {
      report.push(`  Polarity RPMs`);
      let tokens = result.split('\n');
      tokens.forEach((token, index) => {
        report.push(`    ${token}`);
      });
    } else {
      report.push(`  Polarity RPMs not found`);
    }

    result = await rpmSearch('postgresql');
    if (result) {
      report.push(`  PostrgreSQL RPMs`);
      let tokens = result.split('\n');
      tokens.forEach((token, index) => {
        report.push(`    ${token}`);
      });
    } else {
      report.push(`  PostgreSQL RPMs not found`);
    }

    report.push('');
    report.push('  Running PostgreSQL Version');
    result = await pgClient.query('SELECT version()');
    report.push(`    ${result.rows[0].version}`);

    return report.join('\n');
  } catch (err) {
    logger.error(err);
    return '  Error checking RPMs';
  }
}

module.exports = {
  check,
  name
};
