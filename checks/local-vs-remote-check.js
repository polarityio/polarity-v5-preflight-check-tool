const _ = require('lodash');

const name = 'Local vs. Remote Check';

function check(env, config, polarity, pgClient, polarityPath, logger) {
  let report = [];

  // First Check the `.env` file
  if (env.hasOwnProperty('POLARITY_PG_CACHE_HOST')) {
    if (env.POLARITY_PG_CACHE_HOST.endsWith('localhost') || env.POLARITY_PG_CACHE_HOST.endsWith('127.0.0.1')) {
      report.push(`  POLARITY_PG_CACHE_HOST: Is Remote`);
    } else {
      report.push(`  POLARITY_PG_CACHE_HOST: Is Local`);
    }
  } else {
    report.push(`  POLARITY_PG_CACHE_HOST not present in .env`);
  }

  if (env.hasOwnProperty('POLARITY_SESSION_CACHE_HOST')) {
    if (
      env.POLARITY_SESSION_CACHE_HOST.endsWith('localhost') ||
      env.POLARITY_SESSION_CACHE_HOST.endsWith('127.0.0.1')
    ) {
      report.push(`  POLARITY_SESSION_CACHE_HOST: Is Remote`);
    } else {
      report.push(`  POLARITY_SESSION_CACHE_HOST: Is Local`);
    }
  } else {
    report.push(`  POLARITY_SESSION_CACHE_HOST not present in .env`);
  }

  if (env.hasOwnProperty('POLARITY_METRICS_CACHE_HOST')) {
    if (
      env.POLARITY_METRICS_CACHE_HOST.endsWith('localhost') ||
      env.POLARITY_METRICS_CACHE_HOST.endsWith('127.0.0.1')
    ) {
      report.push(`  POLARITY_METRICS_CACHE_HOST: Is Remote`);
    } else {
      report.push(`  POLARITY_METRICS_CACHE_HOST: Is Local`);
    }
  } else {
    report.push(`  POLARITY_METRICS_CACHE_HOST not present in .env`);
  }

  if (env.hasOwnProperty('POLARITY_INTEGRATION_CACHE_HOST')) {
    if (
      env.POLARITY_INTEGRATION_CACHE_HOST.endsWith('localhost') ||
      env.POLARITY_INTEGRATION_CACHE_HOST.endsWith('127.0.0.1')
    ) {
      report.push(`  POLARITY_INTEGRATION_CACHE_HOST: Is Remote`);
    } else {
      report.push(`  POLARITY_INTEGRATION_CACHE_HOST: Is Local`);
    }
  } else {
    report.push(`  POLARITY_INTEGRATION_CACHE_HOST not present in .env`);
  }

  if (env.hasOwnProperty('POLARITY_DB_HOST')) {
    if (env.POLARITY_DB_HOST.endsWith('localhost') || env.POLARITY_DB_HOST.endsWith('127.0.0.1')) {
      report.push(`  POLARITY_DB_HOST: Is Remote`);
    } else {
      report.push(`  POLARITY_DB_HOST: Is Local`);
    }
  } else {
    report.push(`  POLARITY_DB_HOST not present in .env`);
  }

  report.push('\n');

  // Next check to the `config.js`

  const postgresHost = _.get(config, 'postgres.host', null);
  const postgresHost2 = _.get(config, 'polarity.postgres.host', null);

  if (postgresHost === null) {
    report.push(`  postgres.host not present in config.js`);
  } else if (postgresHost.endsWith('localhost') || postgresHost.endsWith('127.0.0.1')) {
    report.push(`  postgres.host: Is Local`);
  } else {
    report.push(`  postgres.host: Is Remote`);
  }

  if (postgresHost2 === null) {
    report.push(`  polarity.postgres.host not present in config.js`);
  } else if (postgresHost2.endsWith('localhost') || postgresHost2.endsWith('127.0.0.1')) {
    report.push(`  polarity.postgres.host: Is Local`);
  } else {
    report.push(`  polarity.postgres.host: Is Remote`);
  }

  let redisHost = _.get(config, 'rest.redisSessionStore.host', null);
  if (redisHost === null) {
    report.push(`  rest.redisSessionStore.host not present in config.js`);
  } else if (redisHost.endsWith('localhost') || redisHost.endsWith('127.0.0.1')) {
    report.push(`  rest.redisSessionStore.host: Is Local`);
  } else {
    report.push(`  rest.redisSessionStore.host: Is Remote`);
  }

  let integrationRedisHost = _.get(config, 'polarity.integrations.cache.redis.host', null);
  if (integrationRedisHost === null) {
    report.push(`  polarity.integrations.cache.redis.host not present in config.js`);
  } else if (integrationRedisHost.endsWith('localhost') || integrationRedisHost.endsWith('127.0.0.1')) {
    report.push(`  polarity.integrations.cache.redis.host: Is Local`);
  } else {
    report.push(`  polarity.integrations.cache.redis.host: Is Remote`);
  }

  return report.join('\n');
}

module.exports = {
  check,
  name
};
