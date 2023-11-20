const name = 'PostgreSQL SSL mode Check';

function check(env, config, polarity, pgClient, polarityPath, logger) {
  if (env.hasOwnProperty('PGSSLMODE')) {
    return `  PGSSLMODE: ${env.PGSSLMODE}`;
  } else {
    return '  PGSSLMODE is not set';
  }
}

module.exports = {
  check,
  name
};
