const name = 'Redis Env Var Checks';

function check(env, config, polarity, pgClient, polarityPath, logger) {
  let reports = [];

  if (env.hasOwnProperty('POLARITY_SESSION_CACHE_PASSWORD')) {
    reports.push(`  POLARITY_SESSION_CACHE_PASSWORD is set`);
  } else {
    reports.push('  POLARITY_SESSION_CACHE_PASSWORD is not set');
  }

  if (env.hasOwnProperty('POLARITY_INTEGRATION_CACHE_PASSWORD')) {
    reports.push(`  POLARITY_INTEGRATION_CACHE_PASSWORD is set`);
  } else {
    reports.push('  POLARITY_INTEGRATION_CACHE_PASSWORD is not set');
  }

  if (env.hasOwnProperty('POLARITY_METRICS_CACHE_PASSWORD')) {
    reports.push(`  POLARITY_METRICS_CACHE_PASSWORD is set`);
  } else {
    reports.push('  POLARITY_METRICS_CACHE_PASSWORD is not set');
  }

  if (env.hasOwnProperty('POLARITY_PG_CACHE_PASSWORD')) {
    reports.push(`  POLARITY_PG_CACHE_PASSWORD is set`);
  } else {
    reports.push('  POLARITY_PG_CACHE_PASSWORD is not set');
  }

  if (env.hasOwnProperty('POLARITY_ENABLE_REDIS_TRANSPORT_ENCRYPTION')) {
    reports.push(`  POLARITY_ENABLE_REDIS_TRANSPORT_ENCRYPTION: ${env.POLARITY_ENABLE_REDIS_TRANSPORT_ENCRYPTION}`);
  } else {
    reports.push('  POLARITY_ENABLE_REDIS_TRANSPORT_ENCRYPTION is not set');
  }

  if (env.hasOwnProperty('POLARITY_INITIALIZE_REDIS_CONFIGS_ON_START')) {
    reports.push(`  POLARITY_INITIALIZE_REDIS_CONFIGS_ON_START: ${env.POLARITY_INITIALIZE_REDIS_CONFIGS_ON_START}`);
  } else {
    reports.push('  POLARITY_INITIALIZE_REDIS_CONFIGS_ON_START is not set');
  }

  return reports.join('\n');
}

module.exports = {
  check,
  name
};
