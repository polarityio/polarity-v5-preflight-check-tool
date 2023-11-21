const { rpmSearch } = require('../utils');

const name = 'Elastic/Splunk RPM Agent Check';

async function check(env, config, polarity, pgClient, polarityPath, logger) {
  const report = [];
  let result;

  if (env.hasOwnProperty('POLARITY_LOG_ENABLE_SYSLOG')) {
    report.push(`  POLARITY_LOG_ENABLE_SYSLOG: ${env.POLARITY_LOG_ENABLE_SYSLOG}`);
  } else {
    report.push('  POLARITY_LOG_ENABLE_SYSLOG is not set');
  }

  if (env.hasOwnProperty('POLARITY_LOG_ENABLE_STDOUT')) {
    report.push(`  POLARITY_LOG_ENABLE_STDOUT: ${env.POLARITY_LOG_ENABLE_STDOUT}`);
  } else {
    report.push('  POLARITY_LOG_ENABLE_STDOUT is not set');
  }

  if (env.hasOwnProperty('POLARITY_LOG_ENABLE_FILE')) {
    report.push(`  POLARITY_LOG_ENABLE_FILE: ${env.POLARITY_LOG_ENABLE_FILE}`);
  } else {
    report.push('  POLARITY_LOG_ENABLE_FILE is not set');
  }

  try {
    result = await rpmSearch('elastic');
    if (result) {
      report.push(`  Elastic Agent RPMs`);
      let tokens = result.split('\n');
      tokens.forEach((token, index) => {
        report.push(`    ${token}`);
      });
    } else {
      report.push(`  Elastic Agent RPMs not found`);
    }

    result = await rpmSearch('logstash');
    if (result) {
      report.push(`  Logstash Agent RPMs`);
      let tokens = result.split('\n');
      tokens.forEach((token, index) => {
        report.push(`    ${token}`);
      });
    } else {
      report.push(`  Logstash RPMs not found`);
    }

    result = await rpmSearch('splunk');
    if (result) {
      report.push(`  Splunk RPMs`);
      let tokens = result.split('\n');
      tokens.forEach((token, index) => {
        report.push(`    ${token}`);
      });
    } else {
      report.push(`  Splunk RPMs not found`);
    }

    return report.join('\n');
  } catch (err) {
    logger.error(err);
    return 'Error checking RPMs';
  }
}

module.exports = {
  check,
  name
};
