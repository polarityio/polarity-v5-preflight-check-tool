const name = 'Analyst Telemetry Check';

function check(env, config, polarity, pgClient, polarityPath, logger) {
  if (env.hasOwnProperty('POLARITY_LOG_INTEGRATION_LOOKUPS')) {
    return `  POLARITY_LOG_INTEGRATION_LOOKUPS: ${env.POLARITY_LOG_INTEGRATION_LOOKUPS}`;
  } else {
    return '  POLARITY_LOG_INTEGRATION_LOOKUPS is not set';
  }
}

module.exports = {
  check,
  name
};
