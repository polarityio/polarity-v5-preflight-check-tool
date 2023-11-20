const { rpmSearch } = require('../utils');

const name = 'Elastic/Splunk RPM Agent Check';

async function check(env, config, polarity, pgClient, polarityPath, logger) {
  const report = [];
  let result;

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
